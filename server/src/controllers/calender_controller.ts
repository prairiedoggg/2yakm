import { Request, Response, NextFunction } from 'express';
const calendarService = require('../services/calender_service');
const { uploadToS3 } = require('../config/imgUploads');

exports.getAllCalendars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const calendars = await calendarService.getAllCalendars(userId);
    res.status(200).json(calendars);
  } catch (error) {
    next(error);
  }
};

exports.getCalendarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const calendar = await calendarService.getCalendarById(id);
    if (calendar) {
      res.status(200).json(calendar);
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.createCalendar = [
  uploadToS3.single('calImg'), // 이미지 업로드 미들웨어 추가
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calImgUrl = req.file ? (req.file as any).location : null; // S3 URL 가져오기
      const newCalendar = await calendarService.createCalendar({ ...req.body, calImg: calImgUrl });
      res.status(201).json(newCalendar);
    } catch (error) {
      next(error);
    }
  }
];

exports.updateCalendar = [
  uploadToS3.single('calImg'), // 이미지 업로드 미들웨어 추가
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const calImgUrl = req.file ? (req.file as any).location : null; // S3 URL 가져오기
      const updatedCalendar = await calendarService.updateCalendar(id, { ...req.body, calImg: calImgUrl });
      if (updatedCalendar) {
        res.status(200).json(updatedCalendar);
      } else {
        res.status(404).json({ message: 'Calendar not found' });
      }
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteCalendar = async (req: Request, res: Response, next: NextFunction) => {
  // ... existing code ...
};