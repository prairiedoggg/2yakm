const { pool } = require('../db');

class MypageService {
  async getUserProfile(userId: string): Promise<{ email: string; username: string }> {
    const result = await pool.query('SELECT email, username FROM users WHERE userid = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const { email, username } = result.rows[0];
    return { email, username };
  }

  updateUserProfile = async (userId: string, updateData: any) => {
    
    const client = await pool.connect();

    try {                  
      const query = `
        UPDATE users 
        SET username = $1, email = $2
        WHERE userid = $3
        RETURNING *`;
    
      const values = [updateData.username, updateData.email, userId];
      const result = await client.query(query, values);
      return result.rows[0];
  }
  finally {
    client.release();
  }
};

  async updateProfilePicture(userId: string, profilePicture: string): Promise<string> {
    const result = await pool.query(
      'UPDATE users SET profilePicture = $1 WHERE userid = $2 RETURNING profilePicture',
      [profilePicture, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0].profilePicture;
  }
}

module.exports = { MypageService };
