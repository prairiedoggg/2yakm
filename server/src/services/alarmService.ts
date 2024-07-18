import schedule from 'node-schedule';
import axios from 'axios';
const { Alarm } = require('../entity/alarm')
const { pool } = require('../db');

const runningJobs = new Map<string, schedule.Job>();

export const scheduleAlarmService = (alarm: typeof Alarm) => {
  const [hours, minutes] = alarm.time.split(':');
  const job = schedule.scheduleJob({
    start: alarm.startDate,
    end: alarm.endDate,
    rule: `${minutes} ${hours} */${Math.floor(alarm.interval / 60)} * * *`
  }, async () => {
    await tempMessage(alarm.message);
  });
  
  runningJobs.set(alarm.id, job);
  console.log(`알람 예약 완료: ${alarm.startDate}부터 ${alarm.endDate}까지 매일 ${alarm.time}에 "${alarm.message}" 알림`);

  return job;
};

//create
export const createAlarm = async (alarm: Omit<typeof Alarm, 'id'>): Promise<typeof Alarm> => {
  const { userId, startDate, endDate, time, interval, message } = alarm;
  
  const startDateString = startDate.toISOString();
  const endDateString = endDate.toISOString();
  
  const query = `
    INSERT INTO alarms (userId, start_date, end_date, time, interval, message)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [userId, startDateString, endDateString, time, interval, message];
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
  const { userId, startDate, endDate, time, interval, message, alarmStatus } = alarm;
  const text = `
    UPDATE alarms
    SET userId = COALESCE($1, userId),
        start_date = COALESCE($2, start_date),
        end_date = COALESCE($3, end_date),
        time = COALESCE($4, time),
        interval = COALESCE($5, interval),
        message = COALESCE($6, message),
        alarm_status = COALESCE($7, alarm_status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *
  `;
  const values = [userId, startDate, endDate, time, interval, message, alarmStatus, id];
  const result = await pool.query(text, values);
  const updatedAlarm = result.rows[0];

  if (updatedAlarm) {
    // 기존 스케줄 취소
    const oldJob = runningJobs.get(id);
    if (oldJob) {
      oldJob.cancel();
    }

    // 새로운 스케줄 설정
    if (updatedAlarm.alarmStatus) {
      scheduleAlarmService(updatedAlarm);
      runningJobs.delete(id);
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

//카카오 연동 전 임시
const tempMessage = async (message : string) =>{
  console.log('메시지', message)
}

const sendKakaoMessage = async (message: string) => {
  const KAKAO_API_URL = 'https://kapi.kakao.com/v1/api/talk/friends/message/default/send';
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

  try {
    const response = await axios.post(KAKAO_API_URL, {
      message,
    }, {
      headers: {
        Authorization: `Bearer ${KAKAO_API_KEY}`,
      },
    });

    if (response.status === 200) {
      console.log('메시지 발송완료:', message);
    } else {
      console.error('메시지 발송실패:', response.data);
    }
  } catch (error) {
    console.error('Error sending Kakao message:', error);
  }
};