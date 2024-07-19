import schedule from 'node-schedule';
import axios from 'axios';
import nodemailer from 'nodemailer';

const { Alarm } = require('../entity/alarm')
const { pool } = require('../db');

const runningJobs = new Map<string, schedule.Job>();

export const scheduleAlarmService = (alarm: typeof Alarm) => {
  alarm.times.forEach((time: { split: (arg0: string) => [any, any]; }) => {
    const [hours, minutes] = time.split(':');
    const job = schedule.scheduleJob(`${minutes} ${hours} * * *`, async () => {
      await sendEmail(alarm.message, alarm.userId);
    });
    
    runningJobs.set(`${alarm.id}_${time}`, job);
  });
  
  console.log(`알람 예약 완료: ${alarm.date}에 ${alarm.times.join(', ')}에 "${alarm.message}" 알림`);
};

export const createAlarm = async (alarm: Omit<typeof Alarm, 'id'>): Promise<typeof Alarm> => {
  const { userId, name, date, times, message } = alarm;
  
  const dateString = date.toISOString();
  
  const query = `
    INSERT INTO alarms (userId, name, date, times, message, alarm_status)
    VALUES ($1, $2, $3, $4::time[], $5, $6)
    RETURNING *
`;
  const values = [userId, name, dateString, times, message, true];
  const result = await pool.query(query, values);
  const newAlarm = result.rows[0];

  scheduleAlarmService(newAlarm);

  return newAlarm;
};
//read  
export const getAlarmsByUserId = async (userId: string): Promise<typeof Alarm[]> => {
  const text = 'SELECT * FROM alarms WHERE userId = $1';
  const result = await pool.query(text, [userId]);
  return result.rows;
};

// Update
export const updateAlarm = async (id: string, alarm: Partial<typeof Alarm>): Promise<typeof Alarm | null> => {
  const { userId, name, date, times, message, alarmStatus } = alarm;
  const text = `
    UPDATE alarms
    SET userId = COALESCE($1, userId),
        name = COALESCE($2, name),
        date = COALESCE($3, date),
        times = COALESCE($4::time[], times),
        message = COALESCE($5, message),
        alarm_status = COALESCE($6, alarm_status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
`;
  const values = [userId, name, date, JSON.stringify(times), message, alarmStatus, id];
  const result = await pool.query(text, values);
  const updatedAlarm = result.rows[0];

  if (updatedAlarm) {
    // 기존 스케줄 취소
    updatedAlarm.times.forEach((time: any) => {
      const jobKey = `${id}_${time}`;
      const oldJob = runningJobs.get(jobKey);
      if (oldJob) {
        oldJob.cancel();
        runningJobs.delete(jobKey);
      }
    });

    // 새로운 스케줄 설정
    if (updatedAlarm.alarmStatus) {
      scheduleAlarmService(updatedAlarm);
    }
  }

  return updatedAlarm;
};


// Delete
export const deleteAlarm = async (id: string): Promise<boolean> => {
  const job = runningJobs.get(id);
  if (job) {
    job.cancel();
    runningJobs.delete(id);
  }

  const query = 'DELETE FROM alarms WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
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
