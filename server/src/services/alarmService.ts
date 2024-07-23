import schedule from 'node-schedule';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { AlarmTime } from '../entity/alarm';
import { createError } from '../utils/error';

const { Alarm } = require('../entity/alarm');
const { pool } = require('../db');

const runningJobs = new Map<string, schedule.Job>();

export const createAlarm = async (alarm: Omit<typeof Alarm, 'id'>): Promise<typeof Alarm> => {
  try {
    const { userId, name, date, times, message } = alarm;
    
    const dateString = date.toISOString();
    
    const query = `
      INSERT INTO alarms (userId, name, date, times, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [userId, name, dateString, JSON.stringify(times), message];
    const result = await pool.query(query, values);
    const newAlarm = result.rows[0];

    scheduleAlarmService(newAlarm);

    return newAlarm;
  } catch (error) {
    throw createError('DBError', '알람 생성 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

export const updateAlarm = async (id: string, alarm: Partial<typeof Alarm>): Promise<typeof Alarm | null> => {
  try {
    const { userId, name, date, times, message } = alarm;
    const text = `
      UPDATE alarms
      SET userId = COALESCE($1, userId),
          name = COALESCE($2, name),
          date = COALESCE($3, date),
          times = COALESCE($4, times::jsonb),
          message = COALESCE($5, message),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      userId,
      name,
      date,
      JSON.stringify(times),
      message,
      id
    ];
    const result = await pool.query(text, values);
    const updatedAlarm = result.rows[0];

    if (!updatedAlarm) {
      throw createError('AlarmNotFound', '해당 알람을 찾을 수 없습니다.', 404);
    }

    // JSON 문자열을 배열로 변환
    updatedAlarm.times = typeof updatedAlarm.times === 'string' ? JSON.parse(updatedAlarm.times) : updatedAlarm.times;

    // 기존 스케줄 취소
    cancelExistingAlarms(id);

    // 새로운 스케줄 설정
    scheduleAlarmService(updatedAlarm);

    return updatedAlarm;
  } catch (error) {
    if (error instanceof Error && error.name === 'AlarmNotFound') throw error;
    throw createError('DBError', '알람 업데이트 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

const cancelExistingAlarms = (alarmId: string) => {
  for (const [key, job] of runningJobs.entries()) {
    if (key.startsWith(`${alarmId}_`)) {
      job.cancel();
      runningJobs.delete(key);
    }
  }
};

export const scheduleAlarmService = (alarm: typeof Alarm) => {
  alarm.times.forEach((alarmTime: AlarmTime) => {
    if (alarmTime.status) {
      const [hours, minutes] = alarmTime.time.split(':');
      const job = schedule.scheduleJob(`${minutes} ${hours} * * *`, async () => {
        await sendEmail(alarm.message, alarm.userId);
      });
      
      runningJobs.set(`${alarm.id}_${alarmTime.time}`, job);
    }
  });
  
  console.log(`알람 예약 완료: ${alarm.date}에 ${alarm.times.map((t: { time: any; }) => t.time).join(', ')}에 "${alarm.message}" 알림`);
};

//read  
export const getAlarmsByUserId = async (userId: string): Promise<typeof Alarm[]> => {
  try {
    const text = 'SELECT * FROM alarms WHERE userId = $1';
    const result = await pool.query(text, [userId]);
    return result.rows;
  } catch (error) {
    throw createError('DBError', '알람 조회 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

//delete
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
    throw createError('DBError', '알람 삭제 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

//메일 발송
const sendEmail = async (message: string, recipientEmail: string) => {
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
    subject: '알람 메시지',
    text: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 완료:', info.response);
  } catch (error) {
    console.error('이메일 발송 실패:', error);
  }
};