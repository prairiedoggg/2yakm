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
  const result = await pool.query('SELECT email, username, profileimg FROM users WHERE userid = $1', [userId]);
  
  if (result.rows.length === 0) {
    throw createError("사용자를 찾을 수 없습니다",'User not found', 404);
  }
  
  const { email, username, profileimg } = result.rows[0];
  return { email, username, profileimg };
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
  const result = await pool.query(
    'UPDATE users SET profileimg = $1 WHERE userid = $2 RETURNING profileimg',
    [profilePicture, userId]
  );

  if (result.rows.length === 0) {
    throw createError("사용자를 찾을 수 없습니다",'User not found', 404);
  }

  return result.rows[0].profileimg;
};

// Function to upload a file to S3
export const uploadFileToS3 = async (file: any, fileName: string): Promise<string> => {
  // Logic to upload file to S3 and return the URL
  // This is a placeholder function. Implement S3 logic here.
  const s3Url = `https://s3.amazonaws.com/yourbucket/${fileName}`;
  return s3Url;
};


