import schedule from 'node-schedule';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { AlarmTime, Alarm } from '../entity/alarm';
import { createError } from '../utils/error';
import { pool } from '../db';
import { isAfter } from 'date-fns';

const runningJobs = new Map<string, schedule.Job>();

export const createAlarm = async (alarm: Omit<Alarm, 'id'>): Promise<Alarm> => {
  try {
    const { userId, name, startDate, endDate, times, alarmStatus } = alarm;
    if (isAfter(startDate, endDate)) {
      throw createError(
        'InvalidDateRange',
        '시작 날짜는 종료 날짜보다 늦을 수 없습니다.',
        400
      );
    }

    const query = `
    INSERT INTO alarms (userId, name, startDate, endDate, times, alarmStatus)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, userId, name, startDate AS "startDate", endDate AS "endDate", times, alarmStatus AS "alarmStatus", createdAt, updatedAt
    `;
    const values = [userId, name, startDate, endDate, JSON.stringify(times), alarmStatus];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    const newAlarm: Alarm = {
      id: row.id,
      userId: row.userId,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
      times: typeof row.times === 'string' ? JSON.parse(row.times) : row.times,
      alarmStatus: row.alarmStatus
    };
    if (newAlarm.alarmStatus) {
      scheduleAlarmService(newAlarm);
    }

    return newAlarm;
  } catch (error) {
    if (error instanceof Error && error.name === 'InvalidDateRange') {
      throw error;
    }
    console.error('알람 생성 오류:', error);
    throw createError('DBError', '알람 생성 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

export const updateAlarm = async (
  id: string,
  alarm: Partial<Alarm>
): Promise<Alarm | null> => {
  try {
    const { userId, name, startDate, endDate, times, alarmStatus } = alarm;
    if (startDate && endDate) {
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        throw createError(
          'InvalidDateRange',
          '시작 날짜는 종료 날짜보다 늦을 수 없습니다.',
          400
        );
      }
    }
    const text = `
      UPDATE alarms
      SET userId = COALESCE($1, userId),
          name = COALESCE($2, name),
          startDate = COALESCE($3, startDate),
          endDate = COALESCE($4, endDate),
          times = COALESCE($5, times::jsonb),
          alarmStatus = COALESCE($6, alarmStatus),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, userId, name, startDate as "startDate", endDate as "endDate", times, alarmStatus as "alarmStatus"
    `;
    const values = [userId, name, startDate, endDate, JSON.stringify(times), alarmStatus, id];
    const result = await pool.query(text, values);
    
    if (result.rows.length === 0) {
      throw createError('AlarmNotFound', '해당 알람을 찾을 수 없습니다.', 404);
    }

    const row = result.rows[0];
    const updatedAlarm: Alarm = {
      id: row.id,
      userId: row.userId,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
      times: typeof row.times === 'string' ? JSON.parse(row.times) : row.times,
      alarmStatus: row.alarmStatus
    };

    // 기존 스케줄 취소
    cancelExistingAlarms(id);

    // 새로운 스케줄 설정
    scheduleAlarmService(updatedAlarm);

    return updatedAlarm;
  } catch (error) {
    console.error('알람 업데이트 오류:', error);
    if (error instanceof Error && error.name === 'AlarmNotFound') throw error;
    if (error instanceof Error) {
      throw createError(
        'DBError',
        `알람 업데이트 중 데이터베이스 오류가 발생했습니다: ${error.message}`,
        500
      );
    } else {
      throw createError(
        'DBError',
        '알람 업데이트 중 알 수 없는 오류가 발생했습니다.',
        500
      );
    }
  }
};

export const updateAlarmStatus = async (id: string, alarmStatus: boolean): Promise<Alarm | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const text = `
      UPDATE alarms
      SET alarmStatus = $1,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, userId, name, startDate AS "startDate", endDate AS "endDate", times, alarmStatus AS "alarmStatus"
    `;
    const values = [alarmStatus, id];
    const result = await client.query(text, values);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      throw createError('AlarmNotFound', '해당 알람을 찾을 수 없습니다.', 404);
    }

    const row = result.rows[0];
    const updatedAlarm: Alarm = {
      id: row.id,
      userId: row.userId,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
      times: typeof row.times === 'string' ? JSON.parse(row.times) : row.times,
      alarmStatus: row.alarmStatus
    };
    await client.query('COMMIT');

    // 기존 스케줄 취소
    cancelExistingAlarms(id);

    // 새로운 스케줄 설정 (알람이 활성화된 경우에만)
    if (updatedAlarm.alarmStatus) {
      scheduleAlarmService(updatedAlarm);
    }

    return updatedAlarm;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('알람 상태 업데이트 오류:', error);
    if (error instanceof Error && error.name === 'AlarmNotFound') throw error;
    if (error instanceof Error) {
      throw createError('DBError', `알람 상태 업데이트 중 데이터베이스 오류가 발생했습니다: ${error.message}`, 500);
    } else {
      throw createError('DBError', '알람 상태 업데이트 중 알 수 없는 오류가 발생했습니다.', 500);
    }
  } finally {
    client.release();
  }
};

const cancelExistingAlarms = (alarmId: string) => {
  for (const [key, job] of runningJobs.entries()) {
    if (key.startsWith(`${alarmId}_`)) {
      if (job && typeof job.cancel === 'function') {
        job.cancel();
        runningJobs.delete(key);
      }
    }
  }
};

export const scheduleAlarmService = (alarm: Alarm) => {
  const { id, startDate, endDate, times, alarmStatus } = alarm;
  if (!alarmStatus) {
    console.log(`알람 ${id}는 비활성화 상태입니다. 스케줄링을 건너뜁니다.`);
    return; 
  }

  const endDateTime = new Date(endDate);
  const startDateTime = new Date(startDate);
  let currentDate = new Date(startDateTime);

  if (currentDate.getTime() <= endDateTime.getTime()) {
    times.forEach((alarmTime: AlarmTime) => {
      const [hours, minutes] = alarmTime.time.split(':');
      const scheduleDate = new Date(startDateTime);
      scheduleDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      while (scheduleDate <= endDateTime) {
        if (scheduleDate >= startDateTime) {
          const job = schedule.scheduleJob(scheduleDate, async () => {
            await sendEmail(alarm.userId);
          });

          runningJobs.set(`${id}_${alarmTime.time}_${scheduleDate.toISOString()}`, job);
        }

        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }
    });
  }
};

export const getAlarmsByUserId = async (userId: string): Promise<Alarm[]> => {
  try {
    const text = `
      SELECT id, userId, name, startDate, endDate, times, alarmStatus
      FROM alarms 
      WHERE userId = $1
    `;    
    const result = await pool.query(text, [userId]);
    return result.rows.map(row => ({
      id: row.id,
      userId: row.userid,
      name: row.name,
      startDate: row.startdate,
      endDate: row.enddate,
      times: typeof row.times === 'string' ? JSON.parse(row.times) : row.times,
      alarmStatus: row.alarmstatus
    }));
  } catch (error) {
    throw createError(
      'DBError',
      '알람 조회 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

export const deleteAlarm = async (id: string): Promise<boolean> => {
  try {
    const job = runningJobs.get(id);
    if (job) {
      job.cancel();
      runningJobs.delete(id);
    }

    const query = 'DELETE FROM alarms WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw createError('AlarmNotFound', '해당 알람을 찾을 수 없습니다.', 404);
    }

    return true;
  } catch (error: any) {
    if (error.name === 'AlarmNotFound') throw error;
    throw createError(
      'DBError',
      '알람 삭제 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

const sendEmail = async (recipientEmail: string) => {
  console.log(`이메일 전송 시도: ${recipientEmail}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: '알람 메시지!',
    text: '약 드세요!!!'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 완료:', info.response);
  } catch (error) {
    console.error('이메일 발송 실패:', error);
  }
};