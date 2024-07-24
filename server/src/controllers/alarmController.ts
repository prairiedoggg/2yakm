import { Request, Response, NextFunction } from 'express';
import { createAlarm, getAlarmsByUserId, updateAlarm, deleteAlarm, scheduleAlarmService } from '../services/alarmService';
import { CustomRequest } from '../types/express.d';

export const createAndScheduleAlarm = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, date, times, message } = req.body;
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }
  try {
    const alarmDate = new Date(date);
    if (isNaN(alarmDate.getTime())) {
      return res.status(400).json({ message: '유효하지 않은 날짜입니다.' });
    }
    
    if (!Array.isArray(times) ?? times.length === 0 ?? !times.every((time: { time: string; }) => /^\d{2}:\d{2}$/.test(time.time))) {
      return res.status(400).json({ message: '유효하지 않은 시간 형식입니다. {time: "HH:MM", status: boolean} 형식의 배열이어야 합니다.' });
    }
    
    const alarm = await createAlarm({
      userId,
      name,
      date: alarmDate,
      times,
      message,
    });

    res.status(201).json(alarm);
  } catch (error) {
    next(error);
    console.error('알람 생성 및 스케줄링 오류', error);
  }
};

export const updateAlarmController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, date, times, message } = req.body;
  const userId = req.user?.email;

  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  try {
    console.log(req.body);
    const alarmDate = date ? new Date(date) : undefined;
    if (alarmDate && isNaN(alarmDate.getTime())) {
      return res.status(400).json({ message: '유효하지 않은 날짜입니다.' });
    }

    if (times && (!Array.isArray(times) ?? times.length === 0 ?? !times.every((time: { time: string; }) => /^\d{2}:\d{2}$/.test(time.time)))) {
      return res.status(400).json({ message: '유효하지 않은 시간 형식입니다. {time: "HH:MM", status: boolean} 형식의 배열이어야 합니다.' });
    }

    const updatedAlarm = await updateAlarm(id, { name, date: alarmDate, times, message, userId });
    if (updatedAlarm) {
      res.status(200).json(updatedAlarm);
    } else {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    }
  } catch (error) {
    next(error);
    console.error('알람 업데이트 오류', error);
  }
};

export const deleteAlarmController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deleted = await deleteAlarm(id);
    if (deleted) {
      res.status(200).json({ message: '알람이 삭제되었습니다' });
    } else {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    }
  } catch (error) {
    next(error);
    console.error('알람 삭제 오류', error);
  }
};

export const getUserAlarmsController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.email;

  try {
    const alarms = await getAlarmsByUserId(userId);
    res.status(200).json(alarms);
  } catch (error) {
    next(error);
    console.error('사용자 알람 조회 오류', error);

  }
};