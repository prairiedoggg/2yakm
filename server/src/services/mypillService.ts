import { pool } from '../db';
import { createError, commonError } from '../utils/error';

interface MyPill {
  mypillid: string;
  name: string;
  expiredat: string;
}

interface UpdateData {
  name: string;
  expiredat: string;
  alarmstatus: boolean;
}

interface MatchedPills {
  pills: MyPill[];
  total: number;
}

interface GetPillsResult {
  totalCount: number;
  totalPages: number;
  data: MyPill[];
}

const matchPill = async (name: string): Promise<MatchedPills> => {
  const query = `
    SELECT * FROM pills WHERE name ILIKE $1
  `;
  const values = [`${name}%`];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount ?? 0 // Handle null case
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError(
        'DatabaseError',
        `Failed to search pills by name: ${error.message}`,
        500
      );
    } else {
      throw createError(
        'UnknownError',
        'Failed to search pills by name: An unknown error occurred',
        500
      );
    }
  }
};

export const addPill = async (
  userId: string,
  updateData: UpdateData
): Promise<{ newPill: MyPill; matchedPills: MatchedPills }> => {
  try {
    const query = `
      INSERT INTO mypills (userid, pillname, expiredat, alarmstatus)
      VALUES ($1, $2, $3, $4) RETURNING pillid, pillname, to_char(expiredat, 'YYYY-MM-DD') as expiredat, alarmstatus
    `;
    const values = [
      userId,
      updateData.name,
      updateData.expiredat,
      updateData.alarmstatus
    ];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError(
        commonError.NO_RESOURCES.name,
        commonError.NO_RESOURCES.message,
        500
      );
    }

    const newPill = result.rows[0];
    const matchedPills = await matchPill(updateData.name);

    return { newPill, matchedPills };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw createError(
        'DatabaseError',
        'Failed to add pill: ' + err.message,
        500
      );
    } else {
      console.error('Unknown error', err);
      throw createError(
        'UnknownError',
        'Failed to add pill due to an unknown error',
        500
      );
    }
  }
};

export const updatePill = async (
  mypillId: string,
  updateData: UpdateData
): Promise<{ updatedPill: MyPill; matchedPills: MatchedPills }> => {
  try {
    const query = `
      UPDATE mypills SET pillname = $1, expiredat = $2, alarmstatus = $3 WHERE pillid = $4 
      RETURNING pillid, pillname, to_char(expiredat, 'YYYY-MM-DD') as expiredat, alarmstatus
    `;
    const values = [
      updateData.name,
      updateData.expiredat,
      updateData.alarmstatus,
      mypillId
    ];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError(
        commonError.USER_NOT_FOUND.name,
        commonError.USER_NOT_FOUND.message,
        404
      );
    }

    const updatedPill = result.rows[0];
    const matchedPills = await matchPill(updateData.name);

    return { updatedPill, matchedPills };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw createError(
        'DatabaseError',
        'Failed to update pill: ' + err.message,
        500
      );
    } else {
      console.error('Unknown error', err);
      throw createError(
        'UnknownError',
        'Failed to update pill due to an unknown error',
        500
      );
    }
  }
};

export const getPills = async (
  userId: string,
  limit: number,
  offset: number,
  sortedBy: string,
  order: string
): Promise<GetPillsResult> => {
  try {
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM mypills
      WHERE userid = $1
    `;
    const countValues = [userId];
    const countResults = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResults.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT pillid, pillname, to_char(expiredat, 'YYYY-MM-DD') as expiredat, alarmstatus
      FROM mypills
      WHERE userid = $1
      ORDER BY ${sortedBy} ${order}
      LIMIT $2 OFFSET $3
    `;
    const values = [userId, limit, offset];
    const { rows } = await pool.query(query, values);

    return {
      totalCount,
      totalPages,
      data: rows
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw createError(
        'DatabaseError',
        'Failed to get pills: ' + err.message,
        500
      );
    } else {
      console.error('Unknown error', err);
      throw createError(
        'UnknownError',
        'Failed to get pills due to an unknown error',
        500
      );
    }
  }
};

export const deletePill = async (mypillId: string): Promise<MyPill> => {
  try {
    const query = `
      DELETE FROM mypills WHERE pillid = $1
      RETURNING pillid, userid, pillname, to_char(expiredat, 'YYYY-MM-DD') as expiredat, alarmstatus
    `;
    const values = [mypillId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError(
        commonError.USER_NOT_FOUND.name,
        commonError.USER_NOT_FOUND.message,
        404
      );
    }

    return result.rows[0];
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw createError(
        'DatabaseError',
        'Failed to delete pill: ' + err.message,
        500
      );
    } else {
      console.error('Unknown error', err);
      throw createError(
        'UnknownError',
        'Failed to delete pill due to an unknown error',
        500
      );
    }
  }
};

export const getPillsExpiringTodayService = async (
  userId: string
): Promise<MyPill[]> => {
  try {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = kst.getFullYear();
    const month = String(kst.getMonth() + 1).padStart(2, '0');
    const date = String(kst.getDate()).padStart(2, '0');

    const today = `${year}-${month}-${date}`;

    const query = `
    SELECT pillid, userid, pillname, expiredat, createdat, alarmstatus 
    FROM mypills
    WHERE userid = $1 AND expiredat = $2
    `;
    const values = [userId, today];
    const result = await pool.query(query, values);

    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error executing query', error.stack);
      throw createError(
        'DatabaseError',
        `Failed to retrieve pills expiring today: ${error.message}`,
        500
      );
    } else {
      console.error('Unknown error', error);
      throw createError(
        'UnknownError',
        'Failed to retrieve pills expiring today due to an unknown error',
        500
      );
    }
  }
};
