import { Router } from 'express';
import * as gptController from '../controllers/chatbotController';
const router = Router();

router.post('/chat', gptController.chat);
router.post('/end', gptController.endChat);

export default router;
