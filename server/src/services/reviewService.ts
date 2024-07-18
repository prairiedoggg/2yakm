import { Request, Response } from 'express';

const { pool } = require('../db');

const createReview = async (
  drugId: number,
  userId: string,
  role: boolean,
  content: string
) => {
  try {
    const query = `
    INSERT INTO reviews (drugId, userId, role, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const values = [drugId, userId, role, content];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createReview };
