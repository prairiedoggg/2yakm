const { Calendar } = require('../entity/calendar');
const pool = require('../db');

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

exports.createCalendar = async (calendar: typeof Calendar): Promise<typeof Calendar> => {
  const text = 'INSERT INTO calendar (userId, date, calImg, condition, weight, temperature, bloodsugar, alarm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  const values = [calendar.userId, calendar.date, calendar.calImg, calendar.condition, calendar.weight, calendar.temperature, calendar.bloodsugar, calendar.alarm];
  const result = await pool.query(text, values);
  return result.rows[0];
};

exports.updateCalendar = async (id: string, calendar: typeof Calendar): Promise<typeof Calendar | null> => {
  const text = 'UPDATE calendar SET calImg = $1, condition = $2, weight = $3, temperature = $4, bloodsugar = $5, alarm = $6 WHERE id = $7 RETURNING *';
  const values = [calendar.calImg, calendar.condition, calendar.weight, calendar.temperature, calendar.bloodsugar, calendar.alarm, id];
  const result = await pool.query(text, values);
  return result.rows[0] || null;
};

exports.deleteCalendar = async (id: string): Promise<boolean> => {
  const text = 'DELETE FROM calendar WHERE id = $1';
  const values = [id];
  const result = await pool.query(text, values);
  return (result.rowCount ?? 0) > 0;
};