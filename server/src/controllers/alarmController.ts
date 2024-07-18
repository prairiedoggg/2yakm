import { Request, Response, NextFunction } from 'express';
import { createAlarm, getAlarmsByUserId, updateAlarm, deleteAlarm, scheduleAlarmService } from '../services/alarmService';
import { CustomRequest } from '../types/express.d';

export const createAndScheduleAlarm = async (req: CustomRequest, res: Response) => {
  const { startDate, duration, interval, message, time } = req.body;
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }
  try {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: '유효하지 않은 시작 날짜입니다.' });
    }
    
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    if (isNaN(end.getTime())) {
      return res.status(400).json({ message: '유효하지 않은 종료 날짜입니다.' });
    }
    
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ message: '유효하지 않은 시간 형식입니다. HH:MM 형식이어야 합니다.' });
    }
    
    const alarm = await createAlarm({
      userId,
      startDate: start,
      endDate: end,
      interval,
      time,
      message,
      alarmStatus: true,
    });

    res.status(201).json(alarm);
  } catch (error) {
    console.error('알람 생성 및 스케줄링 오류', error);
    res.status(500).json({ message: '알람 생성 및 스케줄링 오류 발생' });
  }
};

export const getUserAlarmsController = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.email;

  try {
    const alarms = await getAlarmsByUserId(userId);
    res.status(200).json(alarms);
  } catch (error) {
    console.error('사용자 알람 조회 오류', error);
    res.status(500).json({ message: '사용자 알람 조회 오류 발생' });
  }
};
export const updateAlarmController = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user?.email;

  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  try {
    const updatedAlarm = await updateAlarm(id, { ...updateData, userId });
    if (updatedAlarm) {
      res.status(200).json(updatedAlarm);
    } else {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    }
  } catch (error) {
    console.error('알람 업데이트 오류', error);
    res.status(500).json({ message: '알람 업데이트 오류 발생' });
  }
};

export const deleteAlarmController = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await deleteAlarm(id);
    if (deleted) {
      res.status(200).json({ message: '알람이 삭제되었습니다' });
    } else {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    }
  } catch (error) {
    console.error('알람 삭제 오류', error);
    res.status(500).json({ message: '알람 삭제 오류 발생' });
  }
};