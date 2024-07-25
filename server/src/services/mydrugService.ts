const { pool } = require('../db');
import { v4 as uuidv4 } from 'uuid';

interface PaginatedResult<T> {
  totalCount: number;
  totalPages: number;
  data: T[];
}

const addDrug = async (userId: string, updateData: any): Promise<string> => {
  const mydrugId = uuidv4();

  try {
    const query = `
      INSERT INTO mydrug (mydrugid, userid, drugname, expiredat)
      VALUES ($1, $2, $3, $4) RETURNING drugname, expiredat`;

    const values = [mydrugId, userId, updateData.drugname, updateData.expiredat];
    const result = await pool.query(query, values);

    return `Drug added: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to add drug: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to add drug due to an unknown error');
    }
  }
};

const updateDrug = async (mydrugId: string, updateData: any): Promise<string> => {
  try {
    const query = `
      UPDATE mydrug SET drugname = $1, expiredat = $2 WHERE mydrugid = $3 
      RETURNING mydrugid, drugname, expiredat`;

    const values = [updateData.drugname, updateData.expiredat, mydrugId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Drug not found');
    }

    return `Drug updated: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to update drug: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to update drug due to an unknown error');
    }
  }
};

const getDrugs = async (userId: string, limit: number, offset: number, sortedBy: string, order: string): Promise<PaginatedResult<{ mydrugid: string; drugname: string; expiredat: string }>> => {
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
      throw new Error('Failed to get drugs: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to get drugs due to an unknown error');
    }
  }
};

const deleteDrug = async (mydrugId: string): Promise<string> => {
  try {
    const query = `
      DELETE FROM mydrug WHERE mydrugid = $1
      RETURNING mydrugid, drugname, expiredat`;

    const values = [mydrugId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Drug not found');
    }

    return `Drug deleted: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to delete drug: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to delete drug due to an unknown error');
    }
  }
};

module.exports = {
  addDrug,
  updateDrug,
  getDrugs,
  deleteDrug
};
