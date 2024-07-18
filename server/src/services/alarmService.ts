import schedule from 'node-schedule';
import axios from 'axios';
const { Alarm } = require('../entity/alarm')
const { pool } = require('../db');

/**
 * 시간과 메시지를 기반으로 알람을 예약하는 함수
 * @param time `hh:mm` 형식의 시간 문자열 (예: "14:30")
 * @param message 전송할 메시지 내용
 * @param durationDays 알람 지속 기간 (일)
 */

const runningJobs = new Map<string, schedule.Job>();

export const scheduleAlarmService = (id: string, startDate: Date, endDate: Date, interval: number, message: string) => {
  const job = schedule.scheduleJob({ start: startDate, end: endDate, rule: `*/${interval} * * * *` }, async () => {
    await tempMessage(message);
  });
  
  runningJobs.set(id, job);
  console.log(`알람 예약 완료: ${startDate}부터 ${endDate}까지 ${interval}시간 간격으로 "${message}" 알림`);

  return job;
};

//create
export const createAlarm = async (alarm: Omit<typeof Alarm, 'id'>): Promise<typeof Alarm> => {
  const { userId, startDate, endDate, interval, message } = alarm;
  const query = `
    INSERT INTO alarms (userId, start_date, end_date, interval, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [userId, startDate, endDate, interval, message];
  const result = await pool.query(query, values);
  const newAlarm = result.rows[0];

  scheduleAlarmService(userId, startDate, endDate, interval, message);

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
  const { startDate, endDate, interval, message, alarmStatus } = alarm;
  const text = `
    UPDATE alarms
    SET start_date = COALESCE($1, start_date),
        end_date = COALESCE($2, end_date),
        interval = COALESCE($3, interval),
        message = COALESCE($4, message),
        alarm_status = COALESCE($5, alarm_status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [startDate, endDate, interval, message, alarmStatus, id];
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
      scheduleAlarmService(id, updatedAlarm.start_date, updatedAlarm.end_date, updatedAlarm.interval, updatedAlarm.message);
    } else {
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