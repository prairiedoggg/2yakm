const { pool } = require('../db');

const getUserProfile = async (userId: string): Promise<{ email: string; username: string, profileimg: any }> => {
  const result = await pool.query('SELECT email, username, profileimg FROM users WHERE userid = $1', [userId]);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  const { email, username, profileimg } = result.rows[0];
  return { email, username, profileimg };
};

const updateUsername = async (userId: string, updateData: any) => {
  try {
    const query = `
      UPDATE users 
      SET username = $1 
      WHERE userid = $2
      RETURNING email, username`;

    const values = [updateData.username, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
      throw new Error('Failed to update username: ' + err.message);
    } else {
      console.error('Unknown error', err);
      throw new Error('Failed to update username due to an unknown error');
    }
  }
};

const updateProfilePicture = async (userId: string, profilePicture: string): Promise<string> => {
  const result = await pool.query(
    'UPDATE users SET profileimg = $1 WHERE userid = $2 RETURNING profileimg',
    [profilePicture, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0].profileimg;
};

const uploadFileToS3 = async (file: any, fileName: string): Promise<string> => {
  // Logic to upload file to S3 and return the URL
  // This is a placeholder function. Implement S3 logic here.
  const s3Url = `https://s3.amazonaws.com/yourbucket/${fileName}`;
  return s3Url;
};

export { getUserProfile, updateUsername, updateProfilePicture, uploadFileToS3 };