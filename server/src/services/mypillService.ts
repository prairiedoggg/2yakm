const { pool } = require('../db');

export const addPill = async (userId: string, updateData: any): Promise<string> => {

  try {
    const query = `
      INSERT INTO mypills (userid, pillname, expiredat)
      VALUES ($1, $2, $3) RETURNING pillname, expiredat`;

    const values = [userId, updateData.name, updateData.expiredat];
    const result = await pool.query(query, values);

    return `Pill added: ${result.rows[0].pillname}, Expires at: ${result.rows[0].expiredat}`;
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
      UPDATE mypills SET pillname = $1, expiredat = $2 WHERE pillid = $3 
      RETURNING pillid, pillname, expiredat`;

    const values = [updateData.name, updateData.expiredat, mypillId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Pill not found');
    }

    return `Pill updated: ${result.rows[0].pillname}, Expires at: ${result.rows[0].expiredat}`;
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
      FROM mypills
      WHERE userid = $1`;
    const countValues = [userId];
    const countResults = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResults.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT pillid, pillname, expiredat, created_at
      FROM mypills
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
      DELETE FROM mypills WHERE pillid = $1
      RETURNING userid, pillname, expiredat`;

    const values = [mypillId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Pill not found');
    }

    return `Pill deleted: ${result.rows[0].pillname}, Expires at: ${result.rows[0].expiredat}`;
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


