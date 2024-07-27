import { pool } from '../db';
import { Favorite } from '../entity/favorite';

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
      favorites.favoriteid,
      favorites.userid,
      favorites.id,
      pills.name,
      pills.efficacy,
      favorites.createdAt
    FROM
      favorites
    JOIN
      pills ON favorites.id = pills.id
    WHERE favorites.userid = $1
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

// 약 좋아요 추가, 취소 서비스
export const addCancelFavoritePillService = async (
  id: number,
  userid: string
): Promise<{ message: string; data: Favorite | null }> => {
  try {
    // DB에 좋아요 정보가 있는지 먼저 확인함
    const foundQuery = `
        SELECT * FROM favorites
        WHERE id = $1 AND userid = $2
        `;
    const foundValues = [id, userid];
    const foundResult = await pool.query(foundQuery, foundValues);

    // 좋아요 정보가 있으면 DB에서 삭제
    if (foundResult.rows.length !== 0) {
      const deleteQuery = `
            DELETE FROM favorites
            WHERE id = $1 AND userid = $2
            `;
      const deleteValues = [id, userid];
      const deleteResult = await pool.query(deleteQuery, deleteValues);
      return {
        message: 'deleted',
        data: deleteResult.rows[0]
      };
    }

    // 좋아요 정보를 DB에 추가
    const addQuery = `
    INSERT INTO favorites (id, userid)
    VALUES ($1, $2)
    `;
    const addValues = [id, userid];
    const addResult = await pool.query(addQuery, addValues);
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
  id: number,
  userid: string
): Promise<boolean> => {
  try {
    const query = `
    SELECT * FROM favorites
    WHERE id = $1 AND userid = $2
    `;
    const values = [id, userid];
    const { rows } = await pool.query(query, values);

    return rows.length > 0;
  } catch (error: any) {
    throw error;
  }
};

// // 해당 약의 좋아요 수를 확인하는 서비스
// export const getPillFavoriteCountService = async (
//   id: number
// ): Promise<number> => {
//   try {
//     const query = `
//   SELECT COUNT(*) AS count
//   FROM favorites
//   WHERE id = $1
//   `;
//     const values = [id];
//     const { rows } = await pool.query(query, values);

//     return parseInt(rows[0].count, 10);
//   } catch (error: any) {
//     throw error;
//   }
// };
