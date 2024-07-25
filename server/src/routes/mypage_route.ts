const mypageController = require('../controllers/mypageController');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const authByToken = require('../middlewares/authByToken');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /mypage:
 *   get:
 *     summary: Get user profile
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: User profile found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authByToken, mypageController.getUserprofile);

/**
 * @swagger
 * /mypage:
 *   put:
 *     summary: Update username
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/', authByToken, mypageController.updateName);

/**
 * @swagger
 * /mypage/profile-picture/memory:
 *   put:
 *     summary: Update profile picture (Memory)
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/profile-picture/memory', authByToken, uploadToMemory.single('profilePicture'), mypageController.updateProfilePictureMemory);

/**
 * @swagger
 * /mypage/profile-picture/s3:
 *   put:
 *     summary: Update profile picture (S3)
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/profile-picture/s3', authByToken, uploadToS3.single('profilePicture'), mypageController.updateProfilePictureS3);

export default router
