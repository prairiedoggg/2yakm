import { get, post, put, del, patch } from './api';
import Cookies from 'js-cookie';
import { Alarm } from '../store/alarm';

export const getAlarms = async (): Promise<Alarm[]> => {
  try {
    console.log(Cookies.get('token'));
    const data = await get('/api/alarms');
    console.log('알람 Get:', data);
    return data;
  } catch (error) {
    console.error('알람 Get:', error);
    throw error;
  }
};

export const createAlarm = async (alarm: Omit<Alarm, 'id'>): Promise<Alarm> => {
  try {
    return await post('/api/alarms', alarm);
  } catch (error) {
    console.error('알람 post:', error);
    throw error;
  }
};

export const updateAlarm = async (
  id: string,
  alarm: Partial<Omit<Alarm, 'id'>>
): Promise<Alarm> => {
  try {
    return await put(`/api/alarms/${id}`, alarm);
  } catch (error) {
    console.error('알람 update:', error);
    throw error;
  }
};

export const deleteAlarm = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    return await del(`/api/alarms/${id}`);
  } catch (error) {
    console.error('알람 delete:', error);
    throw error;
  }
};

export const updateAlarmStatus = async (
  id: string,
  alarmStatus: boolean
): Promise<Alarm> => { 
  try {
    return await patch(`/api/alarms/${id}/status`, { alarmStatus })
  } catch (error) { 
    console.log('알람 상태 업데이트 에러:', error)
    throw error
  }
}
