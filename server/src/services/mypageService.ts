const { pool } = require('../db');

class MypageService {
  
  async getUserProfile(userId: string): Promise<{ email: string; username: string, profileimg: any }> {
    const result = await pool.query('SELECT email, username, profileimg FROM users WHERE userid = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const { email, username, profileimg } = result.rows[0];
    return { email, username, profileimg };
  }

  updateUsername = async (userId: string, updateData: any) => {
    
    const client = await pool.connect();

    try {                  
      const query = `
        UPDATE users 
        SET username = $1 
        WHERE userid = $2
        RETURNING email, username`;
    
      const values = [updateData.username, userId];
      const result = await client.query(query, values);
      return result.rows[0];
  }
  finally {
    client.release();
  }
};

  async updateProfilePicture(userId: string, profilePicture: string): Promise<string> {    
    const result = await pool.query(
      'UPDATE users SET profileimg = $1 WHERE userid = $2 RETURNING profileimg',
      [profilePicture, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0].profileimg;
  }
  
}

module.exports = { MypageService };
