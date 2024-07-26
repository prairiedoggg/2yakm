import { get, post, put, del } from './api';
import Cookies from 'js-cookie';

export const getAlarms = async (callback?: (arg0: any) => void) => {
  console.log(Cookies.get('token'));
  const data = await get('/api/alarms');
  console.log('데이터', data);

  if (callback) {
    callback(data);
  }
};

export const createAlarm = async (alarm: any) => {
  return post('/api/alarms', alarm);
};

export const updateAlarm = async (id: string, alarm: any) => {
  return put(`/api/alarms/${id}`, alarm);
};

export const deleteAlarm = async (id: string) => {
  return del(`/api/alarms/${id}`);
};
