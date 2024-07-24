import axios from 'axios';
import { Alarm } from '../store/alarm.ts'; 

export const fetchAlarms = async (): Promise<Alarm[]> => {
  const { data } = await axios.get('http://localhost:3000/api/alarms');
  return data;
};

export const createAlarm = async (newAlarm: Alarm): Promise<Alarm> => {
  const { data } = await axios.post(
    'http://localhost:3000/api/alarms',
    newAlarm
  );
  return data;
};

export const updateAlarm = async (updatedAlarm: Alarm): Promise<Alarm> => {
  const { data } = await axios.put(
    `http://localhost:3000/api/alarms/${updatedAlarm.id}`,
    updatedAlarm
  );
  return data;
};

export const deleteAlarm = async (id: string): Promise<{ message: string }> => {
  const { data } = await axios.delete(`http://localhost:3000/api/alarms/${id}`);
  return data;
};
