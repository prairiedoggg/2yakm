const { pool } = require('../db');
const { Review } = require('../entity/review');
const { createError } = require('../utils/error');

// 리뷰 생성 서비스
exports.createReview = async (
  drugid: number,
  email: string,
  content: string
): Promise<typeof Review | null> => {
  // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
  try {
    const query = `
    INSERT INTO reviews (drugid, email, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const values = [drugid, email, content];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw error;
  }
};

// 리뷰 수정 서비스
exports.updateReview = async (
  reviewid: number,
  email: string,
  content: string
): Promise<typeof Review | null> => {
  try {
    const validationQuery = `
    SELECT email FROM reviews
    WHERE reviewid = $1
    `;
    const validationValues = [reviewid];
    const validationResult = await pool.query(
      validationQuery,
      validationValues
    );

    if (validationResult.rows.length === 0) {
      throw createError('NotFound', '수정할 리뷰를 찾을 수 없습니다.', 404);
    }

    if (email !== validationResult.rows[0].email) {
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
  email: string
): Promise<typeof Review | null> => {
  try {
    const validationQuery = `
    SELECT email FROM reviews
    WHERE reviewid = $1
    `;
    const validationValues = [reviewid];
    const validationResult = await pool.query(
      validationQuery,
      validationValues
    );

    if (validationResult.rows.length === 0) {
      throw createError('NotFound', '삭제할 리뷰를 찾을 수 없습니다.', 404);
    }

    if (email !== validationResult.rows[0].email) {
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
      SELECT 
        reviews.reviewid,
        reviews.drugid,
        drug.drugname,
        reviews.email,
        users.username,
        users.role,
        reviews.content,
        reviews.created_at
      FROM 
        reviews
      JOIN 
        drug ON reviews.drugid = drug.drugid
      JOIN 
        users ON reviews.email = users.email
      WHERE 
        reviews.drugid = $1;
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
  email: string
): Promise<(typeof Review)[]> => {
  try {
    const query = `
      SELECT 
        reviews.reviewid,
        reviews.drugid,
        drug.drugname,
        reviews.email,
        users.username,
        users.role,
        reviews.content,
        reviews.created_at
      FROM 
        reviews
      JOIN 
        drug ON reviews.drugid = drug.drugid
      JOIN 
        users ON reviews.email = users.email
      WHERE 
        reviews.email = $1;
        `;

    const values = [email];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error: any) {
    throw error;
  }
};
