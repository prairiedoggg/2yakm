import { pool } from '../db';
import { Favorite } from '../entity/favorite';
import { QueryResult } from 'pg';

interface TotalCountAndData {
  totalCount: number;
  totalPages: number;
  data: Favorite[];
}

// 즐겨 찾는 약 검색 서비스
export const searchFavoritePillService = async (
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
    FROM favorites
    WHERE userid = $1
`;
    const countValues = [userid];
    const countResults = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResults.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
    SELECT 
      favorites.id,
      favorites.userid,
      favorites.pillid,
      pills.name,
      pills.efficacy,
      favorites.createdAt
    FROM
      favorites
    JOIN
      pills ON favorites.pillid = pills.id
    WHERE favorites.userid = $1
    ORDER BY ${sortedBy} ${order}
    LIMIT $2 OFFSET $3;
    `;

    const values = [userid, limit, offset];
    const result: QueryResult<Favorite> = await pool.query(query, values);

    return {
      totalCount,
      totalPages,
      data: result.rows
    };
  } catch (error: any) {
    throw error;
  }
};

// 약 좋아요 추가, 취소 서비스
export const addCancelFavoritePillService = async (
  pillid: number,
  userid: string
): Promise<{ message: string; data: Favorite | null }> => {
  try {
    // DB에 좋아요 정보가 있는지 먼저 확인함
    const foundQuery = `
        SELECT id FROM favorites
        WHERE pillid = $1 AND userid = $2
        `;
    const foundValues = [pillid, userid];
    const foundResult = await pool.query(foundQuery, foundValues);

    // 좋아요 정보가 있으면 DB에서 삭제
    if (foundResult.rows.length !== 0) {
      const deleteQuery = `
            DELETE FROM favorites
            WHERE pillid = $1 AND userid = $2
            `;
      const deleteValues = [pillid, userid];
      const deleteResult = await pool.query(deleteQuery, deleteValues);
      return {
        message: 'deleted',
        data: deleteResult.rows[0]
      };
    }

    // 좋아요 정보를 DB에 추가
    const addQuery = `
    INSERT INTO favorites (pillid, userid)
    VALUES ($1, $2)
    `;
    const addValues = [pillid, userid];
    const addResult: QueryResult<Favorite> = await pool.query(
      addQuery,
      addValues
    );
    return {
      message: 'added',
      data: addResult.rows[0]
    };
  } catch (error: any) {
    throw error;
  }
};

// 좋아요를 눌렀는지 확인하는 서비스
export const userFavoriteStatusService = async (
  pillid: number,
  userid: string
): Promise<boolean> => {
  try {
    const query = `
    SELECT id FROM favorites
    WHERE pillid = $1 AND userid = $2
    `;
    const values = [pillid, userid];
    const result: QueryResult<Favorite> = await pool.query(query, values);

    return result.rows.length > 0;
  } catch (error: any) {
    throw error;
  }
};

// // 해당 약의 좋아요 수를 확인하는 서비스
// export const getPillFavoriteCountService = async (
//   pillid: number
// ): Promise<number> => {
//   try {
//     const query = `
//   SELECT COUNT(*) AS count
//   FROM favorites
//   WHERE pillid = $1
//   `;
//     const values = [pillid];
//     const { rows } = await pool.query(query, values);

//     return parseInt(rows[0].count, 10);
//   } catch (error: any) {
//     throw error;
//   }
// };
