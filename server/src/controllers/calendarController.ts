import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/express.d';
import { Calendar, Medication } from '../entity/calendar';
import * as calendarService from '../services/calendarService';
import { uploadToS3 } from '../config/imgUploads';

export const getAllCalendars = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.email;
    const calendars: Calendar[] = await calendarService.getAllCalendars(userId);
    res.status(200).json(calendars);
  } catch (error) {
    next(error);
  }
};

export const getCalendarById =  async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const calendar: Calendar | null = await calendarService.getCalendarById(id);
    if (calendar) {
      res.status(200).json(calendar);
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    next(error);
  }
};

const validateMedications = (medications: Medication[]): boolean => {
  return medications.every(med => {
    const [hours, minutes] = med.time.split(':').map(Number);
    return /^\d{2}:\d{2}$/.test(med.time) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
  });
};


export const createCalendar = [
  uploadToS3.single('calImg'),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.email;
      const calImgUrl = req.file ? (req.file as any).location : null;

      const date = req.body.date ? new Date(req.body.date) : new Date();
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: '유효하지 않은 날짜 형식입니다.' });
      }
      
      const medications = req.body.medications ? JSON.parse(req.body.medications) : [];
      if (!Array.isArray(medications) ?? !validateMedications(medications)) {
        return res.status(400).json({ message: '유효하지 않은 약물 시간 형식입니다. 시간은 HH:MM 형식이어야 하며, 00:00에서 23:59 사이여야 합니다.' });
      }
      
      const calendarData: Partial<Calendar> = {
        userId,
        calImg: calImgUrl,
        date: date,
        condition: req.body.condition,
        weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
        temperature: req.body.temperature ? parseFloat(req.body.temperature) : undefined,
        bloodsugarBefore: req.body.bloodsugarBefore ? parseFloat(req.body.bloodsugarBefore) : undefined,
        bloodsugarAfter: req.body.bloodsugarAfter ? parseFloat(req.body.bloodsugarAfter) : undefined,
        medications: medications
      };

      console.log("Processed calendarData:", calendarData);

      const newCalendar: Calendar = await calendarService.createCalendar(calendarData as Omit<Calendar, 'id'>);
      res.status(201).json(newCalendar);
    } catch (error) {
      console.error("Error in createCalendar:", error);
      next(error);
    }
  } 
];

export const updateCalendar  = [
  uploadToS3.single('calImg'),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('Update request body:', req.body);
    console.log('Update request files:', req.files);
    try {
      const { id } = req.params;
      const calImgUrl = req.file ? (req.file as any).location : null;
      
      const medications = JSON.parse(req.body.medications ?? '[]');
      if (!Array.isArray(medications) ?? !validateMedications(medications)) {
        return res.status(400).json({ message: '유효하지 않은 약물 시간 형식입니다. 시간은 HH:MM 형식이어야 하며, 00:00에서 23:59 사이여야 합니다.' });
      }
      const calendarData: Partial<Calendar> = {
        ...req.body,
        calImg: calImgUrl,
        condition: req.body.condition,
        date: req.body.date ? new Date(req.body.date) : undefined,
        weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
        temperature: req.body.temperature ? parseFloat(req.body.temperature) : undefined,
        bloodsugarBefore: req.body.bloodsugarBefore ? parseFloat(req.body.bloodsugarBefore) : undefined,
        bloodsugarAfter: req.body.bloodsugarAfter ? parseFloat(req.body.bloodsugarAfter) : undefined,
        medications: medications
      };
      const updatedCalendar: Calendar | null = await calendarService.updateCalendar(id, calendarData);
      if (updatedCalendar) {
        res.status(200).json(updatedCalendar);
      } else {
        res.status(404).json({ message: '대상 캘린더를 찾을 수 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
];


export const deleteCalendar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.email;
    const { id } = req.params;
    const success: boolean = await calendarService.deleteCalendar(id);
    if (success) {
      res.status(200).json({ message: '캘린더 삭제 완료' });
    } else {
      res.status(404).json({ message: '대상 캘린더를 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

