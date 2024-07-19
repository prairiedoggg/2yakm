import { CustomRequest } from '../types/express';

const { pool } = require('../db');
const { Favorite } = require('../entity/favorite');
const { createError } = require('../utils/error');

interface totalCountAndData {
  totalCount: number;
  totalPages: number;
  data: (typeof Favorite)[];
}

// 즐겨 찾는 약 검색 서비스
exports.searchFavoriteDrug = async (
  userid: string,
  limit: number,
  offset: number,
  sortedBy: string,
  order: string
): Promise<totalCountAndData | null> => {
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
      favorites.drugid,
      drugs.drugname,
      drugs.efficacy,
      favorites.created_at
    FROM
      favorites
    JOIN
      drugs ON favorites.drugid = drugs.drugid
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
exports.addCancelFavoriteDrug = async (
  drugid: number,
  userid: string
): Promise<typeof Favorite | null> => {
  try {
    // DB에 좋아요 정보가 있는지 먼저 확인함
    const foundQuery = `
        SELECT * FROM favorites
        WHERE drugid = $1 AND userid = $2
        `;
    const foundValues = [drugid, userid];
    const foundResult = await pool.query(foundQuery, foundValues);

    // 좋아요 정보가 있으면 DB에서 삭제
    if (foundResult.rows.length !== 0) {
      const deleteQuery = `
            DELETE FROM favorites
            WHERE drugid = $1 AND userid = $2
            `;
      const deleteValues = [drugid, userid];
      const deleteResult = await pool.query(deleteQuery, deleteValues);
      return {
        message: 'deleted',
        data: deleteResult.rows[0]
      };
    }

    // 좋아요 정보를 DB에 추가
    const addQuery = `
    INSERT INTO favorites (drugid, userid)
    VALUES ($1, $2)
    `;
    const addValues = [drugid, userid];
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
exports.userFavoriteStatus = async (
  drugid: number,
  userid: string
): Promise<{ status: boolean }> => {
  try {
    const query = `
    SELECT * FROM favorites
    WHERE drugid = $1 AND userid = $2
    `;
    const values = [drugid, userid];
    const { rows } = await pool.query(query, values);

    return {
      status: rows.length > 0
    };
  } catch (error: any) {
    throw error;
  }
};

// 해당 약의 좋아요 수를 확인하는 서비스
exports.getDrugFavoriteCount = async (
  drugid: number
): Promise<{ count: number }> => {
  try {
    const query = `
  SELECT COUNT(*) AS count
  FROM favorites
  WHERE drugid = $1 
  `;
    const values = [drugid];
    const { rows } = await pool.query(query, values);

    return {
      count: parseInt(rows[0].count, 10)
    };
  } catch (error: any) {
    throw error;
  }
};
