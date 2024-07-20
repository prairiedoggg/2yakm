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
      (userid, date, calimg, condition, weight, temperature, 
      bloodsugarBefore, bloodsugarAfter, medications) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    const values = [
      calendar.userId,
      calendar.date,
      calendar.calImg,
      calendar.condition,
      calendar.weight,
      calendar.temperature,
      calendar.bloodsugarBefore,
      calendar.bloodsugarAfter,
      JSON.stringify(calendar.medications)
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
    // 기존의 medications 데이터를 가져옴
    const existingCalendar = await exports.getCalendarById(id);
    if (!existingCalendar) {
      throw new Error("Calendar not found");
    }

    const existingMedications = existingCalendar.medications || [];
    const newMedications = calendar.medications || [];
    const updatedMedications = [...existingMedications, ...newMedications];

    const text = `
      UPDATE calendar 
      SET calimg = $1, condition = $2, weight = $3, temperature = $4, 
          bloodsugarBefore = $5, bloodsugarAfter = $6,
          medications = $7, date = $8
      WHERE id = $9 
      RETURNING *
    `;
    const values = [
      calendar.calImg,
      calendar.condition,
      calendar.weight,
      calendar.temperature,
      calendar.bloodsugarBefore,
      calendar.bloodsugarAfter,
      JSON.stringify(updatedMedications),
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