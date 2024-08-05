import { pool } from '../db';
import { createError } from '../utils/error';

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
}

// Function to get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const result = await pool.query('SELECT email, username, profileimg FROM users WHERE userid = $1', [userId]);

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    const { email, username, profileimg } = result.rows[0];
    return { email, username, profileimg};
  } catch (error) {
    console.error('Error executing query', error);
    throw createError('DatabaseError','Failed to get user profile', 500)
  }
};


// Define the types for the update data
interface UpdateUsernameData {
  username: string;
}

// Function to update the username
export const updateUsername = async (userId: string, updateData: UpdateUsernameData): Promise<{ email: string; username: string }> => {
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
      throw createError("사용자를 찾을 수 없습니다",'User not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating username:', error);
    throw createError('DatabaseError', 'Failed to update username', 500);
  }
};

// Function to update the profile picture
export const updateProfilePicture = async (userId: string, profilePicture: string): Promise<string> => {
  try {
    const result = await pool.query(
      'UPDATE users SET profileimg = $1 WHERE userid = $2 RETURNING profileimg',
      [profilePicture, userId]
    );

    if (result.rows.length === 0) {
      throw createError("사용자를 찾을 수 없습니다",'User not found', 404);
    }

    return result.rows[0].profileimg;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw createError('DatabaseError', 'Failed to update profile picture', 500);
  }
};

export const addCertification = async (userId: string, name: string, date: string, number: string): Promise<Certification> => {
  try {

    const check = await pool.query(`SELECT * from certification where number = $1`, [number])

    if (check.rows.length !=0) {
      throw createError("이미 등록된 사업자등록증입니다", "Already registered", 403)
    } 

    const verifiedResult = await pool.query(
      `UPDATE users SET isverified = true WHERE userid = $1 RETURNING isverified`,
      [userId]
    );

    const result = await pool.query(
      `INSERT INTO certification (userid, name, date, number) values ($1, $2, $3, $4) returning name, date, number`, 
      [userId, name, date, number]
    );

    const certification: Certification = {
      ...result.rows[0],
      isverified: verifiedResult.rows[0].isverified
    };

    return certification;
  } catch (error) {
    console.error('추가 실패:', error);
    throw createError('DatabaseError', 'Failed to add certification', 500);
  }
}

export const getCertification = async (userId: string): Promise<Certification[]> => {
  try {
    const result = await pool.query('SELECT name, date, number FROM certification WHERE userid = $1', [userId]);

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (error) {
    console.error('사업자등록증을 찾을 수 없습니다:', error);
    throw createError('DatabaseError', 'Failed to get certification', 500);
  }
}

export const deleteCertification = async (userId: string, name: string): Promise<Certification> => {
  try {
    const result = await pool.query('DELETE FROM certification WHERE userid = $1 and name = $2 returning name, date, number', [userId, name]);

    if (result.rows.length === 0) {
      throw createError('사용자를 찾을 수 없습니다', 'User not found', 404);
    }

    const certification = result.rows[0];
    return certification;
  } catch (error) {
    console.error('삭제 실패:', error);
    throw createError('DatabaseError', 'Failed to delete certification', 500);
  }
}
