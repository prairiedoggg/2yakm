const { pool } = require('../db');
const { Review } = require('../entity/review');
const { createError } = require('../utils/error');

interface totalCountAndData {
  totalCount: number;
  totalPages: number;
  data: (typeof Review)[];
}

// 리뷰 생성 서비스
exports.createReview = async (
  drugid: number,
  userid: string,
  content: string
): Promise<typeof Review | null> => {
  // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
  try {
    const query = `
    INSERT INTO reviews (drugid, userid, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const values = [drugid, userid, content];
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

    if (validationResult.rows.length === 0) {
      throw createError('NotFound', '수정할 리뷰를 찾을 수 없습니다.', 404);
    }

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

    if (validationResult.rows.length === 0) {
      throw createError('NotFound', '삭제할 리뷰를 찾을 수 없습니다.', 404);
    }

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

// 해당 약의 모든 리뷰 조회 서비스 (미완성 - cursor-based pagination 추가 예정)
exports.getDrugAllReview = async (
  drugid: number
): Promise<(typeof Review)[]> => {
  try {
    const query = `
      SELECT 
        reviews.reviewid,
        reviews.drugid,
        drugs.drugname,
        reviews.userid,
        users.username,
        users.role,
        reviews.content,
        reviews.created_at
      FROM 
        reviews
      JOIN 
        drugs ON reviews.drugid = drugs.drugid
      JOIN 
        users ON reviews.userid = users.userid
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
  userid: string,
  limit: number,
  offset: number,
  sortedBy: string,
  order: string
): Promise<totalCountAndData> => {
  try {
    // 전체 리뷰 개수 조회
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM reviews
    WHERE userid = $1
`;
    const countValues = [userid];
    const countResults = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResults.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT 
        reviews.reviewid,
        reviews.drugid,
        drugs.drugname,
        reviews.content,
        reviews.created_at
      FROM 
        reviews
      JOIN 
        drugs ON reviews.drugid = drugs.drugid
      JOIN 
        users ON reviews.userid = users.userid
      WHERE 
        reviews.userid = $1
      ORDER BY ${sortedBy} ${order}
      LIMIT $2 OFFSET $3;
        `;

    const values = [userid, limit, offset];
    const { rows } = await pool.query(query, values);

    return {
      totalCount,
      totalPages,
      data: rows
    };
  } catch (error: any) {
    throw error;
  }
};
