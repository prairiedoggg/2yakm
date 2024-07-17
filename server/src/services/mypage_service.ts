const User = require('../entity/user')
const { pool } = require('../db');


class MypageService {
  async getUserProfile(userId: string): Promise<{ email: string; username: string }> {
    const result = await pool.query('SELECT email, username FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const { email, username } = result.rows[0];
    return { email, username };
  }

  async updateUserProfile(userId: string, updateData: Partial<typeof User>): Promise<{ email: string; username: string }> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateData)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING email, username`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const { email, username } = result.rows[0];
    return { email, username };
  }

  async updateProfilePicture(userId: string, profilePicture: string): Promise<string> {
    const result = await pool.query(
      'UPDATE users SET profilePicture = $1 WHERE id = $2 RETURNING profilePicture',
      [profilePicture, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0].profilePicture;
  }
}

module.exports = { MypageService };
