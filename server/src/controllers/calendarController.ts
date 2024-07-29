import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/express.d';
import { Calendar, Medication } from '../entity/calendar';
import * as calendarService from '../services/calendarService';
import { uploadToS3 } from '../config/imgUploads';

interface RequestWithDateParam extends CustomRequest {
  params: {
    date: string;
  };
}

export const getAllCalendars = async (
  req: RequestWithDateParam,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.email;
    const calendars = await calendarService.getAllCalendars(userId);
    res.status(200).json(calendars);
  } catch (error) {
    next(error);
  }
};

export const getCalendarById = async (
  req: RequestWithDateParam,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.email;
    const date = new Date(req.params.date);
    const calendar = await calendarService.getCalendarById(userId, date);
    if (calendar) {
      res.status(200).json(calendar);
    } else {
      res
        .status(404)
        .json({ message: '해당 날짜의 캘린더를 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

const validateMedications = (medications: Medication[]): boolean => {
  return medications.every((med) => {
    const [hours, minutes] = med.time.split(':').map(Number);
    return (
      /^\d{2}:\d{2}$/.test(med.time) &&
      hours >= 0 &&
      hours < 24 &&
      minutes >= 0 &&
      minutes < 60
    );
  });
};

export const createCalendar = [
  uploadToS3.single('calImg'),
  async (req: RequestWithDateParam, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.email;
      const calImgUrl = req.file ? (req.file as any).location : null;

      const date = req.body.date ? new Date(req.body.date) : new Date();
      if (isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ message: '유효하지 않은 날짜 형식입니다.' });
      }

      const medications = req.body.medications
        ? JSON.parse(req.body.medications)
        : [];
      if (!Array.isArray(medications) ?? !validateMedications(medications)) {
        return res
          .status(400)
          .json({
            message:
              '유효하지 않은 약물 시간 형식입니다. 시간은 HH:MM 형식이어야 하며, 00:00에서 23:59 사이여야 합니다.'
          });
      }

      const calendarData: Omit<Calendar, 'id'> = {
        userId,
        calImg: calImgUrl,
        date: date,
        condition: req.body.condition,
        weight: req.body.weight ? parseFloat(req.body.weight) : 0,
        temperature: req.body.temperature
          ? parseFloat(req.body.temperature)
          : 0,
        bloodsugarBefore: req.body.bloodsugarBefore
          ? parseFloat(req.body.bloodsugarBefore)
          : 0,
        bloodsugarAfter: req.body.bloodsugarAfter
          ? parseFloat(req.body.bloodsugarAfter)
          : 0,
        medications: medications
      };

      const newCalendar: Calendar =
        await calendarService.createCalendar(calendarData);
      res.status(201).json(newCalendar);
    } catch (error) {
      console.error('Error in createCalendar:', error);
      if (error instanceof Error && error.name === 'DuplicateCalendar') {
        res.status(409).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
];

export const updateCalendar = [
  uploadToS3.single('calImg'),
  async (req: RequestWithDateParam, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.email;
      const date = new Date(req.params.date);
      const calImgUrl = req.file ? (req.file as any).location : null;

      const { date: _, ...bodyWithoutDate } = req.body;

      const medications = JSON.parse(req.body.medications ?? '[]');
      if (!Array.isArray(medications) ?? !validateMedications(medications)) {
        return res
          .status(400)
          .json({
            message:
              '유효하지 않은 약물 시간 형식입니다. 시간은 HH:MM 형식이어야 하며, 00:00에서 23:59 사이여야 합니다.'
          });
      }
      const calendarData: Partial<Calendar> = {
        ...bodyWithoutDate,
        calImg: calImgUrl,
        condition: req.body.condition,
        weight: req.body.weight ? parseFloat(req.body.weight) : 0,
        temperature: req.body.temperature
          ? parseFloat(req.body.temperature)
          : 0,
        bloodsugarBefore: req.body.bloodsugarBefore
          ? parseFloat(req.body.bloodsugarBefore)
          : 0,
        bloodsugarAfter: req.body.bloodsugarAfter
          ? parseFloat(req.body.bloodsugarAfter)
          : 0,
        medications: medications
      };
      const updatedCalendar: Calendar | null =
        await calendarService.updateCalendar(userId, date, calendarData);
      if (updatedCalendar) {
        res.status(200).json(updatedCalendar);
      } else {
        res
          .status(404)
          .json({ message: '해당 날짜의 캘린더를 찾을 수 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCalendar = async (
  req: RequestWithDateParam,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.email;
    const date = new Date(req.params.date);
    const success: boolean = await calendarService.deleteCalendar(userId, date);
    if (success) {
      res.status(200).json({ message: '캘린더 삭제 완료' });
    } else {
      res
        .status(404)
        .json({ message: '해당 날짜의 캘린더를 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};
