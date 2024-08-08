import * as chatbotService from '../services/chatbotService';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/express.d';

export const chat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;
    const reply = await chatbotService.processQuery(userId, message);
    res.json({ reply });
  } catch (error) {
    console.error('GPT API 오류:', error);
    next(error);
  }
};

export const endChat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const message = chatbotService.endConversation(userId);
    res.json({ message });
  } catch (error) {
    console.error('대화 종료 오류:', error);
    next(error);
  }
};
