const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
import {
  getPillsHandler,
  getPillByIdHandler,
  searchPillsbyNameHandler,
  searchPillsbyEfficacyHandler,
  searchPillsByImageHandler,
  getPillFavoriteCount,
  getPillReviewCount
} from '../controllers/pillController';

import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /api/pills:
 *   get:
 *     summary: 모든 약 정보 가져오기
 *     tags: [pills]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 가져올 약의 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 가져올 약의 시작 위치
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   engname:
 *                     type: string
 *                   companyname:
 *                     type: string
 *                   companyengname:
 *                     type: string
 *                   ingredientname:
 *                     type: string
 *                   ingredientengname:
 *                     type: string
 *                   type:
 *                     type: string
 *                   shape:
 *                     type: string
 *                   efficacy:
 *                     type: string
 *                   dosage:
 *                     type: string
 *                   caution:
 *                     type: string
 *                   storagemethod:
 *                     type: string
 *                   expdate:
 *                      type: string
 *                   source:
 *                      type: string
 *                   imgurl:
 *                      type: string
 */
router.get('/', getPillsHandler);

/**
 * @swagger
 * /api/pills/{id}:
 *   get:
 *     summary: ID로 약 정보 가져오기
 *     tags: [pills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 약 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 engname:
 *                   type: string
 *                 companyname:
 *                   type: string
 *                 companyengname:
 *                   type: string
 *                 ingredientname:
 *                   type: string
 *                 ingredientengname:
 *                   type: string
 *                 type:
 *                   type: string
 *                 shape:
 *                   type: string
 *                 efficacy:
 *                   type: string
 *                 dosage:
 *                   type: string
 *                 caution:
 *                   type: string
 *                 storagemethod:
 *                   type: string
 *                 expdate:
 *                   type: string
 *                 source:
 *                   type: string
 *                 imgurl:
 *                   type: string
 */
router.get('/:id', getPillByIdHandler);

/**
 * @swagger
 * /api/pills/{id}/reviewcount:
 *   get:
 *     summary: 특정 약의 리뷰 수 가져오기
 *     tags: [pills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 약 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewCount:
 *                   type: integer
 */
router.get('/:id/reviewcount', getPillReviewCount);

/**
 * @swagger
 * /api/pills/{id}/favoritecount:
 *   get:
 *     summary: 특정 약의 즐겨찾기 수 가져오기
 *     tags: [pills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 약 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favoriteCount:
 *                   type: integer
 */
router.get('/:id/favoritecount', getPillFavoriteCount);

/**
 * @swagger
 * /api/pills/search/name:
 *   get:
 *     summary: 이름으로 약 검색
 *     tags: [pills]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 약 이름
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 가져올 약의 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 가져올 약의 시작 위치
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   engname:
 *                     type: string
 *                   companyname:
 *                     type: string
 *                   companyengname:
 *                     type: string
 *                   ingredientname:
 *                     type: string
 *                   ingredientengname:
 *                     type: string
 *                   type:
 *                     type: string
 *                   shape:
 *                     type: string
 *                   efficacy:
 *                     type: string
 *                   dosage:
 *                     type: string
 *                   caution:
 *                     type: string
 *                   storagemethod:
 *                     type: string
 *                   expdate:
 *                      type: string
 *                   source:
 *                      type: string
 *                   imgurl:
 *                      type: string
 */
router.get('/search/name', searchPillsbyNameHandler);

/**
 * @swagger
 * /api/pills/search/efficacy:
 *   get:
 *     summary: 효능으로 약 검색
 *     tags: [pills]
 *     parameters:
 *       - in: query
 *         name: efficacy
 *         required: true
 *         schema:
 *           type: string
 *         description: 약 효능
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 가져올 약의 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 가져올 약의 시작 위치
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   engname:
 *                     type: string
 *                   companyname:
 *                     type: string
 *                   companyengname:
 *                     type: string
 *                   ingredientname:
 *                     type: string
 *                   ingredientengname:
 *                     type: string
 *                   type:
 *                     type: string
 *                   shape:
 *                     type: string
 *                   efficacy:
 *                     type: string
 *                   dosage:
 *                     type: string
 *                   caution:
 *                     type: string
 *                   storagemethod:
 *                     type: string
 *                   expdate:
 *                      type: string
 *                   source:
 *                      type: string
 *                   imgurl:
 *                      type: string
 */
router.get('/search/efficacy', searchPillsbyEfficacyHandler);

/**
 * @swagger
 * /api/pills/search/image:
 *   get:
 *     summary: 이미지로 약 검색
 *     tags: [pills]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: 검색할 약 이미지
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 가져올 약의 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 가져올 약의 시작 위치
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       engname:
 *                         type: string
 *                       companyname:
 *                         type: string
 *                       ingredientname:
 *                         type: string
 *                       efficacy:
 *                         type: string
 *                       importWords:
 *                         type: string
 *                       similarity:
 *                         type: string
 *                       imgurl:
 *                         type: string
 *                 totalCount:
 *                   type: integer
 *                   description: 검색된 약의 총 개수
 *                 totalPages:
 *                   type: integer
 *                   description: 총 페이지 수
 *                 limit:
 *                   type: integer
 *                   description: 요청된 약의 개수
 *                 offset:
 *                   type: integer
 *                   description: 요청된 약의 시작 위치
 *             examples:
 *               example1:
 *                 summary: OCR 결과 예시
 *                 value:
 *                   pills:
 *                     - id: 0
 *                       name: "string"
 *                       engname: "string"
 *                       companyname: "string"
 *                       ingredientname: "string"
 *                       efficacy: "string"
 *                       importWords: "string"
 *                   totalCount: 1
 *                   totalPages: 1
 *                   limit: 10
 *                   offset: 0
 *               example2:
 *                 summary: 이미지 유사도 결과 예시
 *                 value:
 *                   pills:
 *                     - id: 0
 *                       name: "string"
 *                       engname: "string"
 *                       companyname: "string"
 *                       ingredientname: "string"
 *                       efficacy: "string"
 *                       imgurl: "string"
 *                       similarity: "string"
 *                   totalCount: 1
 *                   totalPages: 1
 *                   limit: 10
 *                   offset: 0
 */
router.get(
  '/search/image',
  uploadToMemory.single('image'),
  searchPillsByImageHandler
);

export default router;
