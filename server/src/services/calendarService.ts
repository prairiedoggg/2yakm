const { Calendar } = require('../entity/calendar');
const { pool } = require('../db');

exports.getAllCalendars = async (userId: string): Promise<typeof Calendar[]> => {
  const text = 'SELECT * FROM calendar WHERE userId = $1';
  const values = [userId];
  const result = await pool.query(text, values);
  return result.rows;
};

exports.getCalendarById = async (id: string): Promise<typeof Calendar | null> => {
  const text = 'SELECT * FROM calendar WHERE id = $1';
  const values = [id];
  const result = await pool.query(text, values);
  return result.rows[0] || null;
};

exports.createCalendar = async (calendar: Partial<typeof Calendar>): Promise<typeof Calendar> => {
  try {
    const text = `
      INSERT INTO calendar 
      (userid, date, calimg, condition, weight, temperature, bloodsugar) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [
      calendar.userId,
      calendar.date,
      calendar.calImg,
      calendar.condition,
      calendar.weight,
      calendar.temperature,
      calendar.bloodsugar
    ];
    const result = await pool.query(text, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in createCalendar:", error);
    throw error;
  }
};

exports.updateCalendar = async (id: string, calendar: Partial<typeof Calendar>): Promise<typeof Calendar | null> => {
  try {
    const text = `
      UPDATE calendar 
      SET calimg = $1, condition = $2, weight = $3, temperature = $4, bloodsugar = $5, date = $6
      WHERE id = $7 
      RETURNING *
    `;
    const values = [
      calendar.calImg,
      calendar.condition,
      calendar.weight,
      calendar.temperature,
      calendar.bloodsugar,
      calendar.date,
      id
    ];

    console.log("Update SQL Query:", text);
    console.log("Update SQL Values:", values);

    const result = await pool.query(text, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error in updateCalendar:", error);
    throw error;
  }
};

exports.deleteCalendar = async (id: string): Promise<boolean> => {
  const text = 'DELETE FROM calendar WHERE id = $1';
  const values = [id];
  const result = await pool.query(text, values);
  const deletedCount = result.rowCount ?? 0;
  return deletedCount > 0;
};