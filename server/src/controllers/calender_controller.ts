import { Request, Response, NextFunction } from 'express';
const calendarService = require('../services/calender_service');

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

exports.createCalendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCalendar = await calendarService.createCalendar(req.body);
    res.status(201).json(newCalendar);
  } catch (error) {
    next(error);
  }
};

exports.updateCalendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedCalendar = await calendarService.updateCalendar(id, req.body);
    if (updatedCalendar) {
      res.status(200).json(updatedCalendar);
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCalendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await calendarService.deleteCalendar(id);
    if (deleted) {
      res.status(200).json({ message: 'Calendar deleted' });
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    next(error);
  }
};