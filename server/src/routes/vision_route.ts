import { Router } from 'express';
import { uploadAndDetectText } from '../controllers/visionController';

const router = Router();

router.post('/detect-text', uploadAndDetectText);

export default router;
