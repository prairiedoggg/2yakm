import { pool } from '../db';
import { createError } from '../utils/error';
import axiosRequest from '../utils/axios';

// Define the types for the returned user profile data
interface UserProfile {
  email: string;
  username: string;
  profileimg: string;
}

interface Certification {
  name: string;
  date: string;
  number: string;
  role: boolean;
}

interface CertificationResponse {
  status_code: string;
  data: Array<{
    b_no: string;
    valid: string;
    valid_msg: string;
  }>;
}

// Function to get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const result = await pool.query(
      'SELECT email, username, profileimg FROM users WHERE userid = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    const { email, username, profileimg } = result.rows[0];
    return { email, username, profileimg };
  } catch (error) {
    console.error('Error executing query', error);
    throw createError('DatabaseError', 'Failed to get user profile', 500);
  }
};

// Define the types for the update data
interface UpdateUsernameData {
  username: string;
}

// Function to update the username
export const updateUsername = async (
  userId: string,
  updateData: UpdateUsernameData
): Promise<{ email: string; username: string }> => {
  try {
    const query = `
      UPDATE users 
      SET username = $1 
      WHERE userid = $2
      RETURNING email, username
    `;

    const values = [updateData.username, userId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating username:', error);
    throw createError('DatabaseError', 'Failed to update username', 500);
  }
};

// Function to update the profile picture
export const updateProfilePicture = async (
  userId: string,
  profilePicture: string
): Promise<string> => {
  try {
    const result = await pool.query(
      'UPDATE users SET profileimg = $1 WHERE userid = $2 RETURNING profileimg',
      [profilePicture, userId]
    );

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    return result.rows[0].profileimg;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw createError('DatabaseError', 'Failed to update profile picture', 500);
  }
};

export const addCertification = async (
  userId: string,
  name: string,
  date: string,
  btype: string,
  number: string
): Promise<Certification> => {
  try {
    const check = await pool.query(
      `SELECT number from certification where number = $1`,
      [number]
    );

    if (check.rows.length !== 0) {
      throw createError(
        'Already registered',
        '이미 등록된 사업자등록증입니다.',
        403
      );
    }

    const apiUrl = process.env.CERTIFICATION_API_URL;
    const apiKey = process.env.CERTIFICATION_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error('API URL 또는 API Key가 설정되지 않았습니다.');
    }

    if (!btype.includes('의약품')) {
      throw createError(
        'Business Type Error',
        '주 종목에 의약품이 없습니다.',
        400
      );
    }

    const requestData = {
      businesses: [
        {
          b_no: number,
          start_dt: date,
          p_nm: name,
          b_type: btype
        }
      ]
    };

    let response;
    try {
      response = await axiosRequest<CertificationResponse>({
        method: 'post',
        url: `${apiUrl}?serviceKey=${apiKey}`,
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (apiError) {
      console.error('API 요청 실패:', apiError);
      throw createError('APIError', 'Failed to validate certification', 500);
    }

    const { status_code, data } = response;

    if (status_code !== 'OK' || data[0].valid !== '01') {
      throw createError(
        'Invalid certification number',
        '유효하지 않은 사업자등록증 번호입니다.',
        400
      );
    }

    const verifiedResult = await pool.query(
      `UPDATE users SET role = true WHERE userid = $1 RETURNING role`,
      [userId]
    );

    const result = await pool.query(
      `INSERT INTO certification (userid, name, date, number, type) values ($1, $2, $3, $4, $5) returning name, date, number`,
      [userId, name, date, number, btype]
    );

    const certification: Certification = {
      ...result.rows[0],
      role: verifiedResult.rows[0].role
    };

    return certification;
  } catch (error) {
    console.error('addCertification Error:', error);
    throw createError('DatabaseError', 'Failed to add certification', 500);
  }
};

export const getCertification = async (
  userId: string
): Promise<Certification[]> => {
  try {
    const result = await pool.query(
      'SELECT name, date, number FROM certification WHERE userid = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (error) {
    if (error instanceof Error)
      console.error('사업자등록증을 찾을 수 없습니다:', error.message);
    throw createError('DatabaseError', 'Failed to get certification', 500);
  }
};

export const deleteCertification = async (
  userId: string,
  name: string
): Promise<Certification> => {
  try {
    const result = await pool.query(
      'DELETE FROM certification WHERE userid = $1 and name = $2 returning name, date, number',
      [userId, name]
    );

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    const certification = result.rows[0];
    return certification;
  } catch (error) {
    console.error('삭제 실패:', error);
    throw createError('DatabaseError', 'Failed to delete certification', 500);
  }
};
