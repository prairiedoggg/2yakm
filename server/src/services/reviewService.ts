const { pool } = require('../db');
const { Review } = require('../entity/review');

// 리뷰 생성 서비스
exports.createReview = async (
  drugId: number,
  drugName: string,
  userId: string,
  role: boolean,
  content: string
): Promise<typeof Review | null> => {
  // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
  try {
    const query = `
    INSERT INTO reviews (drugId, drugName, userId, role, content)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const values = [drugId, drugName, userId, role, content];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

// 리뷰 수정 서비스
exports.updateReview = async (
  reviewId: number,
  userId: string,
  content: string
): Promise<typeof Review | null> => {
  try {
    const query = `
        UPDATE reviews
        SET content = $1
        WHERE reviewId = $2
        RETURNING *
        `;
    const values = [content, reviewId];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

// 리뷰 삭제 서비스
exports.deleteReview = async (
  reviewId: number,
  userId: string
): Promise<typeof Review | null> => {
  try {
    const query = `
        DELETE FROM reviews
        WHERE reviewId = $1
        RETURNING *
        `;
    const values = [reviewId];
    const { rows } = await pool.query(query, values);

    return rows.length ? rows[0] : null;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

// 해당 약의 모든 리뷰 조회 서비스
exports.getDrugAllReview = async (
  drugId: number
): Promise<(typeof Review)[]> => {
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
    throw err;
  }
};

// 해당 유저의 모든 리뷰 조회 서비스
exports.getUserAllReview = async (
  userId: string
): Promise<(typeof Review)[]> => {
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
    throw err;
  }
};
