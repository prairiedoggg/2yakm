import { get, post, put, del, patch } from './api';
import { Alarm } from '../store/alarm';

export const getAlarms = async (): Promise<void> => {
  try {
    const data = await get('/api/alarms');
    console.log('알람 Get:', data);
  } catch (error) {
    console.error('알람 Get:', error);
    throw error;
  }
};

export const createAlarm = async (alarm: Omit<Alarm, 'id'>): Promise<void> => {
  try {
    await post('/api/alarms', alarm);
  } catch (error) {
    console.error('알람 post:', error);
    throw error;
  }
};

export const updateAlarm = async (
  id: Alarm['id'],
  alarm: Omit<Alarm, 'id'>
): Promise<void> => {
  try {
    await put(`/api/alarms/${id}`, alarm);
  } catch (error) {
    console.error('알람 update:', error);
    throw error;
  }
};

export const deleteAlarm = async (id: string): Promise<void> => {
  try {
    await del(`/api/alarms/${id}`);
  } catch (error) {
    console.error('알람 delete:', error);
    throw error;
  }
};

export const updateAlarmStatus = async (
  id: Alarm['id'],
  alarmStatus: boolean
): Promise<void> => {
  try {
    await patch(`/api/alarms/${id}/status`, { alarmStatus });
  } catch (error) {
    console.error('알람 상태 업데이트 에러:', error);
    throw error;
  }
};
