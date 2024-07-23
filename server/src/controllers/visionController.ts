import { Request, Response, NextFunction } from 'express';
import vision from '@google-cloud/vision';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Multer 설정
const upload = multer({ dest: 'uploads/' });

const client = new vision.ImageAnnotatorClient();

export const uploadAndDetectText = [
  upload.single('image'), // 'image' 필드로 파일 업로드
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: '이미지를 업로드 해주세요.' });
        return;
      }

      const filePath = path.join(__dirname, '../../', req.file.path);
      const imageBuffer = fs.readFileSync(filePath);
      const imageBase64 = imageBuffer.toString('base64');

      // 이미지에서 텍스트 감지
      const [result] = await client.textDetection({ image: { content: imageBase64 } });
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        res.status(404).json({ message: '텍스트를 감지하지 못했습니다.' });
        return;
      }

      const text = detections.map((text) => text.description).join('\n');
      console.log(text);
      res.status(200).json({ message: '텍스트 감지 성공', text });
      
      // 파일 삭제
      fs.unlinkSync(filePath);
    } catch (error) {
      next(error);
    }
  },
];
