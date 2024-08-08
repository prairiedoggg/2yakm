import { Request, Response, NextFunction } from 'express';
import {
  createAlarm,
  getAlarmsByUserId,
  updateAlarm,
  deleteAlarm,
  updateAlarmStatus
} from '../services/alarmService';
import { CustomRequest } from '../types/express.d';
import { AlarmTime, Alarm } from '../entity/alarm';

export const createAndScheduleAlarm = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, startDate, endDate, times } = req.body;
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }
  try {
    const alarmStartDate = new Date(startDate);
    const alarmEndDate = new Date(endDate);
    if (isNaN(alarmStartDate.getTime()) || isNaN(alarmEndDate.getTime())) {
      return res.status(400).json({ message: '유효하지 않은 날짜입니다.' });
    }

    if (
      !Array.isArray(times) ||
      times.length === 0 ||
      !times.every((time: { time: string }) => {
        const [hours, minutes] = time.time.split(':').map(Number);
        return (
          /^\d{2}:\d{2}$/.test(time.time) &&
          hours >= 0 &&
          hours < 24 &&
          minutes >= 0 &&
          minutes < 60
        );
      })
    ) {
      return res.status(400).json({
        message:
          '유효하지 않은 시간 형식입니다. {time: "HH:MM", status: boolean} 형식의 배열이어야 하며, 시간은 00:00에서 23:59 사이여야 합니다.'
      });
    }
    const alarm = await createAlarm({
      userId,
      name,
      startDate: alarmStartDate,
      endDate: alarmEndDate,
      times,
      alarmStatus: true
    });
    res.status(201).json(alarm);
  } catch (error) {
    next(error);
    console.error('알람 생성 및 스케줄링 오류', error);
  }
};

export const updateAlarmController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, startDate, endDate, times, alarmStatus } = req.body;
  const userId = req.user?.email;

  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  try {
    const updateData: Partial<Alarm> = {};
    if (name !== undefined) updateData.name = name;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (times !== undefined) updateData.times = times;
    if (alarmStatus !== undefined) updateData.alarmStatus = alarmStatus;

    // 유효성 검사
    if (
      updateData.startDate &&
      updateData.endDate &&
      updateData.startDate > updateData.endDate
    ) {
      return res
        .status(400)
        .json({ message: '시작 날짜는 종료 날짜보다 늦을 수 없습니다.' });
    }

    if (
      updateData.times &&
      (!Array.isArray(updateData.times) ||
        updateData.times.length === 0 ||
        !updateData.times.every((time: { time: string }) => {
          const [hours, minutes] = time.time.split(':').map(Number);
          return (
            /^\d{2}:\d{2}$/.test(time.time) &&
            hours >= 0 &&
            hours < 24 &&
            minutes >= 0 &&
            minutes < 60
          );
        }))
    ) {
      return res
        .status(400)
        .json({ message: '유효하지 않은 시간 형식입니다.' });
    }

    const updatedAlarm = await updateAlarm(id, updateData);
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

export const updateAlarmStatusController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { alarmStatus } = req.body;
  const userId = req.user?.email;

  if (!userId) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  if (typeof alarmStatus !== 'boolean') {
    return res
      .status(400)
      .json({ message: 'alarmStatus는 boolean 타입이어야 합니다.' });
  }

  try {
    const updatedAlarm = await updateAlarmStatus(id, alarmStatus);
    if (updatedAlarm) {
      res.status(200).json(updatedAlarm);
    } else {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    }
  } catch (error) {
    console.error('알람 상태 업데이트 오류', error);
    if (error instanceof Error && error.name === 'AlarmNotFound') {
      res.status(404).json({ message: '알람을 찾을 수 없습니다' });
    } else {
      next(error);
    }
  }
};

export const deleteAlarmController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
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

export const getUserAlarmsController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.email;

  try {
    const alarms = await getAlarmsByUserId(userId);
    res.status(200).json(alarms);
  } catch (error) {
    next(error);
    console.error('사용자 알람 조회 오류', error);
  }
};
