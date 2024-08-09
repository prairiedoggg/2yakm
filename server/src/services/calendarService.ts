import { Calendar, Medication } from '../entity/calendar';
import { pool } from '../db';
import { createError } from '../utils/error';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
import { QueryResult } from 'pg';

const TIMEZONE = 'Asia/Seoul';
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// 날짜를 한국 시간으로 변환하는 함수
const convertToKoreanTime = (date: Date): Date => {
  return utcToZonedTime(date, TIMEZONE);
};

export const getAllCalendars = async (userId: string): Promise<Calendar[]> => {
  try {
    const text = `
      SELECT id, userId AS "userId", date, calImg AS "calImg", condition, weight, temperature, 
      bloodsugarBefore AS "bloodsugarBefore", bloodsugarAfter AS "bloodsugarAfter", medications
      FROM calendar 
      WHERE userId = $1
    `;    
    const values = [userId];
    const result: QueryResult<Calendar> = await pool.query(text, values);
    return result.rows.map(row => ({
      id: row.id,
      userId: row.userId,
      date: convertToKoreanTime(row.date),
      calImg: row.calImg,
      condition: row.condition,
      weight: row.weight,
      temperature: row.temperature,
      bloodsugarBefore: row.bloodsugarBefore,
      bloodsugarAfter: row.bloodsugarAfter,
      medications: typeof row.medications === 'string' ? JSON.parse(row.medications) : row.medications
    }));
  } catch (error) {
    console.error('getAllCalendars 오류:', error);
    throw createError('DBError', `캘린더 조회 중 데이터베이스 오류가 발생했습니다. 원인: ${getErrorMessage(error)}`, 500);
  }
};

export const getCalendarById = async (userId: string, date: Date): Promise<Calendar | null> => {
  try {
    const dateString = format(zonedTimeToUtc(date, TIMEZONE), 'yyyy-MM-dd');
    const text = `
      SELECT id, userId AS "userId", date, calImg AS "calImg", condition, weight, temperature, 
      bloodsugarBefore AS "bloodsugarBefore", bloodsugarAfter AS "bloodsugarAfter", medications
      FROM calendar 
      WHERE userId = $1 AND date = $2
    `;    
    const values = [userId, dateString];
    const result: QueryResult<Calendar>  = await pool.query(text, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.userId,
      date: convertToKoreanTime(row.date),
      calImg: row.calImg,
      condition: row.condition,
      weight: row.weight,
      temperature: row.temperature,
      bloodsugarBefore: row.bloodsugarBefore,
      bloodsugarAfter: row.bloodsugarAfter,
      medications: typeof row.medications === 'string' ? JSON.parse(row.medications) : row.medications
    };
  } catch (error) {
    console.error('getCalendarByDate 오류:', error);
    throw createError('DBError', `캘린더 조회 중 데이터베이스 오류가 발생했습니다. 원인: ${getErrorMessage(error)}`, 500);
  }
};

export const createCalendar = async (calendar: Omit<Calendar, 'id'>): Promise<Calendar> => {
  try {
    const existingCalendar = await getCalendarById(calendar.userId, calendar.date);
    if (existingCalendar) {
      throw createError('DuplicateCalendar', '해당 날짜에 이미 일정이 존재합니다.', 409);
    }
    const text = `
      INSERT INTO calendar 
      (userid, date, calimg, condition, weight, temperature, 
        bloodsugarBefore, bloodsugarAfter, medications) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id, userId, date, calImg AS "calImg", condition, weight, temperature, 
        bloodsugarBefore AS "bloodsugarBefore", bloodsugarAfter AS "bloodsugarAfter", medications
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
    const result: QueryResult<Calendar>  = await pool.query(text, values);
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.userId,
      date: convertToKoreanTime(row.date),
      calImg: row.calImg,
      condition: row.condition,
      weight: row.weight,
      temperature: row.temperature,
      bloodsugarBefore: row.bloodsugarBefore,
      bloodsugarAfter: row.bloodsugarAfter,
      medications: typeof row.medications === 'string' ? JSON.parse(row.medications) : row.medications
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'DuplicateCalendar') {
      throw error;
    }
    console.error('createCalendar 오류:', error);
    throw createError('DBError', `캘린더 생성 중 데이터베이스 오류가 발생했습니다. 원인: ${getErrorMessage(error)}`, 500);
  }
};

export const updateCalendar = async (
  userId: string,
  date: Date,
  calendar: Partial<Calendar>
): Promise<Calendar | null> => {
  try {
    const existingCalendar = await getCalendarById(userId, date);
    if (!existingCalendar) {
      throw createError('CalendarNotFound', '해당 날짜의 캘린더를 찾을 수 없습니다..', 404);
    }

    const updatedMedications = calendar.medications ?? existingCalendar.medications;

    const text = `
      UPDATE calendar 
      SET calimg = $1, condition = $2, weight = $3, temperature = $4, 
          bloodsugarBefore = $5, bloodsugarAfter = $6,
          medications = $7
      WHERE userId = $8 AND date = $9
      RETURNING id, userId, date, calImg AS "calImg", condition, weight, temperature, 
      bloodsugarBefore AS "bloodsugarBefore", bloodsugarAfter AS "bloodsugarAfter", medications
    `;
    const values = [
      calendar.calImg ?? null,
      calendar.condition ?? existingCalendar.condition,
      calendar.weight ?? existingCalendar.weight,
      calendar.temperature ?? existingCalendar.temperature,
      calendar.bloodsugarBefore ?? existingCalendar.bloodsugarBefore,
      calendar.bloodsugarAfter ?? existingCalendar.bloodsugarAfter,
      JSON.stringify(updatedMedications),
      userId,
      calendar.date ?? existingCalendar.date
    ];

    const result: QueryResult<Calendar>  = await pool.query(text, values);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.userId,
      date: convertToKoreanTime(row.date),
      calImg: row.calImg,
      condition: row.condition,
      weight: row.weight,
      temperature: row.temperature,
      bloodsugarBefore: row.bloodsugarBefore,
      bloodsugarAfter: row.bloodsugarAfter,
      medications: typeof row.medications === 'string' ? JSON.parse(row.medications) : row.medications
    };
  } catch (error) {
    console.error('updateCalendar 오류:', error);
    if (error instanceof Error && error.name === 'CalendarNotFound') throw error;
    throw createError('DBError', `캘린더 업데이트 중 데이터베이스 오류가 발생했습니다. 원인: ${getErrorMessage(error)}`, 500);
  }
};

export const deleteCalendar = async (userId: string, date: Date): Promise<boolean> => {
  try {
    const dateString = format(zonedTimeToUtc(date, TIMEZONE), 'yyyy-MM-dd');
    const text = 'DELETE FROM calendar WHERE userId = $1 AND date = $2';
    const values = [userId, dateString];
    const result: QueryResult<Calendar>  = await pool.query(text, values);
    const deletedCount = result.rowCount ?? 0;
    
    if (deletedCount === 0) {
      throw createError('CalendarNotFound', '해당 날짜의 캘린더를 찾을 수 없습니다.', 404);
    }
    
    return true;
  } catch (error) {
    console.error('deleteCalendar 오류:', error);
    if (error instanceof Error && error.name === 'CalendarNotFound') throw error;
    throw createError('DBError', `캘린더 삭제 중 데이터베이스 오류가 발생했습니다. 원인: ${getErrorMessage(error)}`, 500);
  }
};