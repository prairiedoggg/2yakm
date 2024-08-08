import { pool, withTransaction } from '../db';
import { Review } from '../entity/review';
import { createError } from '../utils/error';
import { QueryResult, PoolClient } from 'pg';

interface TotalCountAndData {
  totalCount: number;
  totalPages: number;
  data: Review[];
}

interface CursorBasedPaginationResult {
  reviews: Review[];
  nextCursor: number | null;
}

// 리뷰 생성 서비스
export const createReviewService = async (
  pillid: number,
  userid: string,
  content: string
): Promise<Review | null> => {
  try {
    // transaction 시작
    const result = await withTransaction(async (client: PoolClient) => {
      // 매개변수화된 쿼리 (SQL 인젝션 공격을 방지할 수 있음)
      const insertQuery = `
    INSERT INTO reviews (pillid, userid, content) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
      const insertValues = [pillid, userid, content];
      const insertResult: QueryResult<Review> = await client.query(
        insertQuery,
        insertValues
      );

      const insertedid = insertResult.rows[0].id;

      const query = `
    SELECT 
      reviews.id,
      reviews.pillid,
      pills.name,
      reviews.userid,
      users.username,
      users.profileimg,
      reviews.content,
      reviews.createdAt
    FROM 
      reviews
    JOIN 
      pills ON reviews.pillid = pills.id
    JOIN 
      users ON reviews.userid = users.userid
    WHERE 
      reviews.id = $1
  `;
      const values = [insertedid];
      const result: QueryResult<Review> = await client.query(query, values);

      return result.rows.length ? result.rows[0] : null;
    });

    return result;
  } catch (error: any) {
    console.error('DB error:', error);
    throw createError(
      'DBError',
      '리뷰 생성 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

// 리뷰 수정 서비스
export const updateReviewService = async (
  id: number,
  userid: string,
  content: string
): Promise<Review | null> => {
  try {
    const query = `
        UPDATE reviews
        SET content = $1
        WHERE id = $2 AND userid = $3
        RETURNING *
        `;
    const values = [content, id, userid];
    const result: QueryResult<Review> = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError(
        'NotFound',
        '수정할 리뷰가 없거나 본인의 리뷰가 아닙니다.',
        400
      );
    }

    return result.rows.length ? result.rows[0] : null;
  } catch (error: any) {
    console.error('DB error:', error);
    throw createError(
      'DBError',
      '리뷰 수정 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

// 리뷰 삭제 서비스
export const deleteReviewService = async (
  id: number,
  userid: string
): Promise<Review | null> => {
  try {
    const query = `
        DELETE FROM reviews
        WHERE id = $1 AND userid = $2
        RETURNING *
        `;
    const values = [id, userid];
    const result: QueryResult<Review> = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError(
        'NotFound',
        '삭제할 리뷰가 없거나 본인의 리뷰가 아닙니다.',
        400
      );
    }

    return result.rows.length ? result.rows[0] : null;
  } catch (error: any) {
    console.error('DB error:', error);
    throw createError(
      'DBError',
      '리뷰 삭제 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

// 해당 약의 모든 리뷰 조회 서비스
export const getPillsAllReviewService = async (
  pillid: number,
  initialLimit?: number,
  cursorLimit?: number,
  cursor?: number
): Promise<CursorBasedPaginationResult> => {
  try {
    let query = `
      SELECT 
        reviews.id,
        reviews.pillid,
        pills.name,
        reviews.userid,
        users.username,
        users.role,
        users.profileimg,
        reviews.content,
        reviews.createdAt
      FROM 
        reviews
      JOIN 
        pills ON reviews.pillid = pills.id
      JOIN 
        users ON reviews.userid = users.userid
      WHERE 
        reviews.pillid = $1
        `;

    const values: any[] = [pillid];

    // 첫 번째 자료를 불러올 때는 initialLimit 값 사용, 그 이후 스크롤을 했을 때는 cursorLimit 값을 이용해서 자료를 가져옴
    if (cursor) {
      query += ` AND (reviews.id < $2)`;
      values.push(cursor);
      query += `
        ORDER BY reviews.id DESC
        LIMIT $3
      `;
      values.push(cursorLimit);
    } else {
      query += `
        ORDER BY reviews.id DESC
        LIMIT $2
      `;
      values.push(initialLimit);
    }

    const result: QueryResult<Review> = await pool.query(query, values);

    let nextCursor: number | null = null;

    // 배열 index는 0으로 시작하기 때문에, lastReview를 가져오려면 자료의 길이에서 -1을 해주어야함, 예)길이가 10이면 마지막 자료는 rows[9]
    if (result.rows.length === (cursor ? cursorLimit : initialLimit)) {
      const lastReview = result.rows[result.rows.length - 1];
      nextCursor = lastReview.id !== undefined ? lastReview.id : null;
    }

    return {
      reviews: result.rows,
      nextCursor
    };
  } catch (error: any) {
    console.error('DB error:', error);
    throw createError(
      'DBError',
      '해당 약의 리뷰 조회 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};

// 해당 유저의 모든 리뷰 조회 서비스
export const getUserAllReviewService = async (
  userid: string,
  limit: number,
  offset: number,
  sortedBy: string,
  order: string
): Promise<TotalCountAndData> => {
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
        reviews.id,
        reviews.pillid,
        pills.name,
        reviews.content,
        reviews.createdAt
      FROM 
        reviews
      JOIN 
        pills ON reviews.pillid = pills.id
      WHERE 
        reviews.userid = $1
      ORDER BY ${sortedBy} ${order}
      LIMIT $2 OFFSET $3;
        `;

    const values = [userid, limit, offset];
    const result: QueryResult<Review> = await pool.query(query, values);

    return {
      totalCount,
      totalPages,
      data: result.rows
    };
  } catch (error: any) {
    console.error('DB error:', error);
    throw createError(
      'DBError',
      '해당 유저의 리뷰 조회 중 데이터베이스 오류가 발생했습니다.',
      500
    );
  }
};
