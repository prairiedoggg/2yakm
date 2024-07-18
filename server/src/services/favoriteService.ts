const { pool } = require('../db');
const { Favorite } = require('../entity/favorite');
const { createError } = require('../utils/error');

interface totalCountAndData {
  totalCount: number;
  data: (typeof Favorite)[];
}

// 즐겨 찾는 약 검색 서비스
exports.searchFavoriteDrug = async (
  email: string
): Promise<totalCountAndData | null> => {
  try {
    const query = `
    SELECT 
      favorites.email,
      favorites.drugid,
      drugs.drugname,
      drugs.efficacy
    FROM
      favorites
    JOIN
      drugs ON favorites.drugid = drugs.drugid
    WHERE favorites.email = $1
    `;

    const values = [email];
    const { rows } = await pool.query(query, values);

    return {
      totalCount: rows.length,
      data: rows
    };
  } catch (error: any) {
    throw error;
  }
};

// 약 좋아요 추가, 취소 서비스
exports.addCancelFavoriteDrug = async (
  drugid: number,
  email: string
): Promise<typeof Favorite | null> => {
  try {
    // DB에 좋아요 정보가 있는지 먼저 확인함
    const foundQuery = `
        SELECT * FROM favorites
        WHERE drugid = $1 AND email = $2
        `;
    const foundValues = [drugid, email];
    const foundResult = await pool.query(foundQuery, foundValues);

    // 좋아요 정보가 있으면 DB에서 삭제
    if (foundResult.rows.length !== 0) {
      const deleteQuery = `
            DELETE FROM favorites
            WHERE drugid = $1 AND email = $2
            `;
      const deleteValues = [drugid, email];
      const deleteResult = await pool.query(deleteQuery, deleteValues);
      return {
        message: 'deleted',
        data: deleteResult.rows[0]
      };
    }

    // 좋아요 정보를 DB에 추가
    const addQuery = `
    INSERT INTO favorites (drugid, email)
    VALUES ($1, $2)
    `;
    const addValues = [drugid, email];
    const addResult = await pool.query(addQuery, addValues);
    return {
      message: 'added',
      data: addResult.rows[0]
    };
  } catch (error: any) {
    throw error;
  }
};
