import { Request, Response, NextFunction } from 'express';
import { createAlarm, getAlarmsByUserId, updateAlarm, deleteAlarm, scheduleAlarmService } from '../services/alarmService';

export const createAndScheduleAlarm = async (req: Request, res: Response) => {
  const { userId, startDate, duration, interval, message } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    
    const alarm = await createAlarm({
      userId,
      startDate: start,
      endDate: end,
      interval,
      message,
      alarmStatus: true,
    });

    const job = scheduleAlarmService( userId, start, end, interval, message );
    
    res.status(201).json({ ...alarm, jobScheduled: !!job });
  } catch (error) {
    console.error('알람 생성 및 스케줄링 오류', error);
    res.status(500).json({ message: '알람 생성 및 스케줄링 오류 발생' });
  }
};

export const getUserAlarmsController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const alarms = await getAlarmsByUserId(userId);
    res.status(200).json(alarms);
  } catch (error) {
    console.error('사용자 알람 조회 오류', error);
    res.status(500).json({ message: '사용자 알람 조회 오류 발생' });
  }
};

export const updateAlarmController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAlarm = await updateAlarm(id, updateData);
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

export const deleteAlarmController = async (req: Request, res: Response) => {
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