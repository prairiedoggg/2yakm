import schedule from 'node-schedule';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { AlarmTime } from '../entity/alarm';
import { createError } from '../utils/error';
import { Alarm } from '../entity/alarm';
import { pool } from '../db';

const runningJobs = new Map<string, schedule.Job>();

export const createAlarm = async (alarm: Omit<Alarm, 'id'>): Promise<Alarm> => {
  try {
    const { userId, name, startDate, endDate, times } = alarm;
    const query = `
    INSERT INTO alarms (userId, name, startDate, endDate, times)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING       id,
    userId As "userId",
    name,
    startDate AS "startDate",
    endDate AS "endDate",
    times,
    created_at AS "createdAt",
    updated_at AS "updatedAt"
    `;
    const values = [userId, name, startDate, endDate, JSON.stringify(times)];
    const result = await pool.query(query, values);
    const newAlarm = result.rows[0];
    
    console.log('newAlarm', newAlarm)
    const schedule = {startdate:'',enddate:'',times:0}
    schedule.startdate = newAlarm.startDate;
    schedule.enddate = newAlarm.endDate;
    schedule.times = newAlarm.times;
    scheduleAlarmService(newAlarm);
    
    return newAlarm;
  } catch (error) {
    throw createError('DBError', '알람 생성 중 데이터베이스 오류가 발생했습니다.', 500);
  }
};

export const updateAlarm = async (id: string, alarm: Partial<Alarm>): Promise<Alarm | null> => {
  try {
    const { userId, name, startDate, endDate, times } = alarm;
    const text = `
      UPDATE alarms
      SET userId = COALESCE($1, userId),
          name = COALESCE($2, name),
          startDate = COALESCE($3, startDate),
          endDate = COALESCE($4, endDate),
          times = COALESCE($5, times::jsonb),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING userid AS "userId", name, startDate AS "startDate", endDate AS "endDate", times
    `;
    const values = [
      userId,
      name,
      startDate,
      endDate,
      JSON.stringify(times),
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
export const scheduleAlarmService = (alarm: Alarm) => {
  const { startDate, endDate, times } = alarm;
  console.log("alarm", alarm);
  const endDateTime = new Date(endDate);
  const startDateTime = new Date(startDate);
  let currentDate = new Date(startDateTime);

    // 테스트용 즉시 실행 알람
    const testDate = new Date(Date.now() + 10000); // 10초 후 실행
    const testJob = schedule.scheduleJob(testDate, async () => {
      console.log('테스트 알람', alarm);
      console.log('테스트 알람 user id', alarm.userId);
      console.log(`테스트 알람 실행: ${alarm.id}, 시간: ${testDate.toISOString()}`);
      await sendEmail(alarm.userId);
    });
    console.log(`테스트 알람 예약됨: ${alarm.id}, 시간: ${testDate.toISOString()}`);
    runningJobs.set(`${alarm.id}_test_${testDate.toISOString()}`, testJob);

  while (currentDate <= endDateTime) {
    times.forEach((alarmTime: AlarmTime) => {
      if (alarmTime.status) {
        const [hours, minutes] = alarmTime.time.split(':');
        const scheduleDate = new Date(currentDate);
        scheduleDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (scheduleDate >= new Date(startDate) && scheduleDate <= endDateTime) {
          const job = schedule.scheduleJob(scheduleDate, async () => {
            console.log(`알람 실행: ${alarm.id}, 시간: ${scheduleDate.toISOString()}`);
            await sendEmail(alarm.userId);
          });
          
          console.log(`알람 예약됨: ${alarm.id}, 시간: ${scheduleDate.toISOString()}`);
          runningJobs.set(`${alarm.id}_${alarmTime.time}_${scheduleDate.toISOString()}`, job);
        }
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`알람 예약 완료: ${startDate}부터 ${endDate}까지 ${times.map((t: { time: any; }) => t.time).join(', ')}에 알림`);
};


//read  
export const getAlarmsByUserId = async (userId: string): Promise<Alarm[]> => {
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
    subject: '알람 메시지',
    text: '약 드세요!'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 완료:', info.response);
  } catch (error) {
    console.error('이메일 발송 실패:', error);
  }
};