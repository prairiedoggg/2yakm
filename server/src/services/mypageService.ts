import { pool } from '../db';
import { createError } from '../utils/error';

// Define the types for the returned user profile data
interface UserProfile {
  email: string;
  username: string;
  profileimg: string;
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
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw createError('QueryError', 'Failed to update username', 500);
    } else {
      console.error('Unknown error', err);
      throw createError('UnknownError', 'Failed to update username due to an unknown error', 500);
    }
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




