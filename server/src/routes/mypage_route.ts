import { Router } from 'express';
const router = Router();
import {getUserprofile, updateName, updateProfilePictureMemory, updateProfilePictureS3} from '../controllers/mypageController';

const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');

/**
 * @swagger
 * api/mypage:
 *   get:
 *     summary: 사용자 프로필 가져오기
 *     tags: [mypage]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 profileimg:
 *                   type: string
 */
router.get('/', getUserprofile);

/**
 * @swagger
 * api/mypage:
 *   put:
 *     summary: 사용자 이름 업데이트
 *     tags: [mypage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 새사용자이름
 *     responses:
 *       200:
 *         description: 성공
 */
router.put('/', updateName);

/**
 * @swagger
 * api/mypage/profile-picture/memory:
 *   put:
 *     summary: 메모리에 프로필 사진 업데이트
 *     tags: [mypage]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: 업로드할 프로필 사진
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileimg:
 *                   type: string
 */
router.put('/profile-picture/memory', uploadToMemory.single('profilePicture'), updateProfilePictureMemory);

/**
 * @swagger
 * api/mypage/profile-picture/s3:
 *   put:
 *     summary: S3에 프로필 사진 업데이트
 *     tags: [mypage]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: 업로드할 프로필 사진
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileimg:
 *                   type: string
 */
router.put('/profile-picture/s3', uploadToS3.single('profilePicture'), updateProfilePictureS3);

export default router;
