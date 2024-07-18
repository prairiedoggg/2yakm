import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/express.d';
import { Calendar } from '../entity/calendar';
const calendarService = require('../services/calendarService');
const { uploadToS3 } = require('../config/imgUploads');

exports.getAllCalendars = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const calendars: Calendar[] = await calendarService.getAllCalendars(userId);
    res.status(200).json(calendars);
  } catch (error) {
    next(error);
  }
};

exports.getCalendarById = async (req: CustomRequest, res: Response, next: NextFunction) => {
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

exports.createCalendar = [
  uploadToS3.single('calImg'),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const calImgUrl = req.file ? (req.file as any).location : null;
      const calendarData: Partial<Calendar> = {
        ...req.body,
        userId,
        calImg: calImgUrl,
        date: new Date(req.body.date),
        weight: parseFloat(req.body.weight),
        temperature: parseFloat(req.body.temperature),
        bloodsugar: parseFloat(req.body.bloodsugar),
        alarm: new Date(req.body.alarm)
      };
      const newCalendar: Calendar = await calendarService.createCalendar(calendarData);
      res.status(201).json(newCalendar);
    } catch (error) {
      next(error);
    }
  } 
];

exports.updateCalendar = [
  uploadToS3.single('calImg'),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const calImgUrl = req.file ? (req.file as any).location : null;
      const calendarData: Partial<Calendar> = {
        ...req.body,
        calImg: calImgUrl,
        date: req.body.date ? new Date(req.body.date) : undefined,
        weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
        temperature: req.body.temperature ? parseFloat(req.body.temperature) : undefined,
        bloodsugar: req.body.bloodsugar ? parseFloat(req.body.bloodsugar) : undefined,
        alarm: req.body.alarm ? new Date(req.body.alarm) : undefined
      };
      const updatedCalendar: Calendar | null = await calendarService.updateCalendar(id, calendarData);
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

exports.deleteCalendar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const success: boolean = await calendarService.deleteCalendar(id);
    if (success) {
      res.status(200).json({ message: 'Calendar deleted successfully' });
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    next(error);
  }
};