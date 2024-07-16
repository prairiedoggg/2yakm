const { pool } = require('../db');

// 리뷰 생성 서비스
const createReview = async (
  drugId: number,
  drugName: string,
  userId: string,
  role: boolean,
  content: string
) => {
  // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
  try {
    const query = `
    INSERT INTO reviews (drugId, drugName, userId, role, content)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const values = [drugId, drugName, userId, role, content];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (err: any) {
    console.log(err);
  }
};

// 리뷰 수정 서비스
const updateReview = async (
  reviewId: number,
  userId: string,
  content: string
) => {
  try {
    const query = `
        UPDATE reviews
        SET content = $1
        WHERE reviewId = $2
        RETURNING *
        `;
    const values = [content, reviewId];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (err: any) {
    console.log(err);
  }
};

// 리뷰 삭제 서비스
const deleteReview = async (reviewId: number, userId: string) => {
  try {
    const query = `
        DELETE FROM reviews
        WHERE reviewId = $1
        RETURNING *
        `;
    const values = [reviewId];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (err: any) {
    console.log(err);
  }
};

// 해당 약의 모든 리뷰 조회 서비스
const getDrugAllReview = async (drugId: number) => {
  try {
    const query = `
        SELECT * FROM reviews
        WHERE drugId = $1
        `;

    const values = [drugId];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (err: any) {
    console.log(err);
  }
};

// 해당 유저의 모든 리뷰 조회 서비스
const getUserAllReview = async (userId: string) => {
  try {
    const query = `
        SELECT * FROM reviews
        WHERE userId = $1
        `;

    const values = [userId];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (err: any) {
    console.log(err);
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getDrugAllReview,
  getUserAllReview
};
