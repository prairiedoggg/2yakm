const { pool } = require('../db');
const { Review } = require('../entity/review');
const { createError } = require('../utils/error');

// drug table에서 drugid를 이용해서 drugname을 받아오는 서비스
const getDrugnameByDrugid = async (drugid: number): Promise<string | null> => {
  try {
    const query = `
      SELECT drugname
      FROM drug
      WHERE drugid = $1
    `;
    const values = [drugid];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0].drugname : null;
  } catch (error: any) {
    throw error;
  }
};

// 리뷰 생성 서비스
exports.createReview = async (
  drugid: number,
  userid: string,
  role: boolean,
  content: string
): Promise<typeof Review | null> => {
  // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
  try {
    const drugname = await getDrugnameByDrugid(drugid);

    const query = `
    INSERT INTO reviews (drugid, drugname, userid, role, content)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const values = [drugid, drugname, userid, role, content];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw error;
  }
};

// 리뷰 수정 서비스
exports.updateReview = async (
  reviewid: number,
  userid: string,
  content: string
): Promise<typeof Review | null> => {
  try {
    const validationQuery = `
    SELECT userid FROM reviews
    WHERE reviewid = $1
    `;
    const validationValues = [reviewid];
    const validationResult = await pool.query(
      validationQuery,
      validationValues
    );

    if (userid !== validationResult.rows[0].userid) {
      throw createError('unAuthorized', '수정 권한이 없습니다.', 401);
    }

    const query = `
        UPDATE reviews
        SET content = $1
        WHERE reviewid = $2
        RETURNING *
        `;
    const values = [content, reviewid];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw error;
  }
};

// 리뷰 삭제 서비스
exports.deleteReview = async (
  reviewid: number,
  userid: string
): Promise<typeof Review | null> => {
  try {
    const validationQuery = `
    SELECT userid FROM reviews
    WHERE reviewid = $1
    `;
    const validationValues = [reviewid];
    const validationResult = await pool.query(
      validationQuery,
      validationValues
    );

    if (userid !== validationResult.rows[0].userid) {
      throw createError('unAuthorized', '수정 권한이 없습니다.', 401);
    }

    const query = `
        DELETE FROM reviews
        WHERE reviewid = $1
        RETURNING *
        `;
    const values = [reviewid];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw error;
  }
};

// 해당 약의 모든 리뷰 조회 서비스
exports.getDrugAllReview = async (
  drugid: number
): Promise<(typeof Review)[]> => {
  try {
    const query = `
        SELECT * FROM reviews
        WHERE drugid = $1
        `;

    const values = [drugid];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error: any) {
    throw error;
  }
};

// 해당 유저의 모든 리뷰 조회 서비스
exports.getUserAllReview = async (
  userid: string
): Promise<(typeof Review)[]> => {
  try {
    const query = `
        SELECT * FROM reviews
        WHERE userid = $1
        `;

    const values = [userid];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error: any) {
    throw error;
  }
};
