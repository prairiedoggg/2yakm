import { Router } from 'express';
const router = Router();
import {
  getUserprofile,
  updateName,
  updateProfilePictureS3,
  addCert,
  deleteCert,
  getCert
} from '../controllers/mypageController';

/**
 * @swagger
 * /api/mypage:
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
 * /api/mypage:
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
 * /api/mypage/profile-picture:
 *   put:
 *     summary: S3에 프로필 사진 업데이트
 *     tags: [mypage]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profileImg
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
router.put('/profile-picture', updateProfilePictureS3);

/**
 * @swagger
 * /api/mypage/certifications:
 *   get:
 *     summary: 사용자 ID로 인증서 조회
 *     tags:
 *       - Certification
 *     responses:
 *       '200':
 *         description: 성공적으로 조회되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   number:
 *                     type: string
 *       '401':
 *         description: 접근 권한이 없습니다.
 *       '500':
 *         description: 내부 서버 오류
 */
router.get('/certifications', getCert);

/**
 * @swagger
 * /api/mypage/certifications:
 *   post:
 *     summary: 새로운 사업자등록증 추가
 *     tags:
 *       - Certification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 description: date(YYYYMMDD)
 *               btype:
 *                 type: string
 *                 description: 사업자등록증의 종목에서 가장 첫 번째 항목을 입력해주세요. (의약품 문구가 포함되어야 함)
 *               number:
 *                 type: string
 *                 description: 숫자로 이루어진 10자리 값만 가능 ('-' 등의 기호 반드시 제거 후 호출)
 *     responses:
 *       '200':
 *         description: 성공적으로 생성되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 btype:
 *                   type: string
 *                 number:
 *                   type: string
 *       '400':
 *         description: 유효하지 않은 사업자등록증입니다 / 주 종목에 의약품이 없습니다.
 *       '403':
 *         description: 이미 등록된 사업자등록증입니다
 *       '500':
 *         description: 내부 서버 오류
 */
router.post('/certifications', addCert);

/**
 * @swagger
 * /api/mypage/certifications:
 *   delete:
 *     summary: 사용자 ID와 이름으로 인증서 삭제
 *     tags:
 *       - Certification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 성공적으로 삭제되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 number:
 *                   type: string
 *       '404':
 *         description: 사용자를 찾을 수 없습니다
 *       '500':
 *         description: 내부 서버 오류
 */
router.delete('/certifications', deleteCert);

export default router;
