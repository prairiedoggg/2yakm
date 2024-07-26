import { get, post, put, del } from './api';
import Cookies from 'js-cookie';

// 에러 처리를 추가한 getAlarms 함수
export const getAlarms = async (): Promise<any> => {
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

export const createAlarm = async (alarm: any): Promise<any> => {
  try {
    return await post('/api/alarms', alarm);
  } catch (error) {
    console.error('알람 post:', error);
    throw error;
  }
};

export const updateAlarm = async (id: string, alarm: any): Promise<any> => {
  try {
    return await put(`/api/alarms/${id}`, alarm);
  } catch (error) {
    console.error('알람 update:', error);
    throw error;
  }
};

export const deleteAlarm = async (id: string): Promise<any> => {
  try {
    return await del(`/api/alarms/${id}`);
  } catch (error) {
    console.error('알람 ㅇㄷ:', error);
    throw error;
  }
};
