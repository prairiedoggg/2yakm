const { pool } = require('../db');
import { v4 as uuidv4 } from 'uuid';


export const addPill = async (userId: string, updateData: any): Promise<string> => {
  const mypillId = uuidv4();

  try {
    const query = `
      INSERT INTO mydrug (mydrugid, userid, drugname, expiredat)
      VALUES ($1, $2, $3, $4) RETURNING drugname, expiredat`;

    const values = [mypillId, userId, updateData.name, updateData.expiredat];
    const result = await pool.query(query, values);

    return `Pill added: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to add pill: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to add pill due to an unknown error');
    }
  }
};

export const updatePill = async (mypillId: string, updateData: any): Promise<string> => {
  try {
    const query = `
      UPDATE mydrug SET drugname = $1, expiredat = $2 WHERE mydrugid = $3 
      RETURNING mydrugid, drugname, expiredat`;

    const values = [updateData.name, updateData.expiredat, mypillId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Pill not found');
    }

    return `Pill updated: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to update pill: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to update pill due to an unknown error');
    }
  }
};

export const getPills = async (userId: string, limit: number, offset: number, sortedBy: string, order: string)=> {
  try {
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM mydrug
      WHERE userid = $1`;
    const countValues = [userId];
    const countResults = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResults.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT mydrugid, drugname, expiredat, created_at
      FROM mydrug
      WHERE userid = $1
      ORDER BY ${sortedBy} ${order}
      LIMIT $2 OFFSET $3`;

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
      throw new Error('Failed to get pills: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to get pills due to an unknown error');
    }
  }
};

export const deletePill = async (mypillId: string): Promise<string> => {
  try {
    const query = `
      DELETE FROM mydrug WHERE mydrugid = $1
      RETURNING mydrugid, drugname, expiredat`;

    const values = [mypillId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Pill not found');
    }

    return `Pill deleted: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to delete pill: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to delete pill due to an unknown error');
    }
  }
};

