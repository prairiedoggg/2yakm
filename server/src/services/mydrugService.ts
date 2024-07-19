const { pool } = require('../db');

interface PaginatedResult<T> {
  totalCount: number;
  totalPages: number;
  data: T[];
}

class MydrugService {

  async addDrug(userId: string, updateData: any): Promise<string> {    
    function generateId() {
        const timestamp = Date.now().toString(); // Current timestamp
        const randomString = Math.random().toString(36).substring(2, 15); // Random string
        return timestamp + randomString;
    }
    
    const mydrugId = generateId();

    const client = await pool.connect();

    try {                  
        const query = `
        INSERT INTO mydrug (mydrugid, userid, drugname, expiredat, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING drugname, expiredat`;
      
        const values = [mydrugId, userId, updateData.drugname, updateData.expiredat, updateData.created_at];
        const result = await client.query(query, values);
        // Assuming you want to return a string
        return `Drug added: ${result.rows[0].drugname}, Expires at: ${result.rows[0].expiredat}`;
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error executing query', err.stack);
        throw new Error('Failed to add drug: ' + err.message);
    } else {
        console.error('Unknown error', err);
        throw new Error('Failed to add drug due to an unknown error');
    }
    }  
    finally {
        client.release();
    }
}
    
    
    async updateDrug(mydrugId: string, updateData: any): Promise<string> {    
      const result = await pool.query(
        `UPDATE mydrug SET drugname = $1, expiredat = $2, created_at = $3 WHERE mydrugid = $4 
        RETURNING mydrugid, drugname, expiredat`,
        [updateData.drugname, updateData.expiredat, updateData.created_at, mydrugId]
      );
    
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0];
    }

    async getDrugs(userId: string, limit: number, offset: number, sortedBy: string, order: string): Promise<PaginatedResult<{ mydrugid: string; drugname: string; expiredat: string }>> {
            
      try {
        // 전체 리뷰 개수 조회
        const countQuery = `
        SELECT COUNT(*) AS total
        FROM mydrug
        WHERE userId = $1
    `;
        const countValues = [userId];
        const countResults = await pool.query(countQuery, countValues);
        const totalCount = parseInt(countResults.rows[0].total, 10);
        const totalPages = Math.ceil(totalCount / limit);
    
        const query = `
          SELECT 
            mydrugid,drugname,expiredat, created_at
          FROM 
            mydrug
          WHERE 
            userid = $1
          ORDER BY ${sortedBy} ${order}
          LIMIT $2 OFFSET $3
            `;
    
        const values = [userId, limit, offset];
        const { rows } = await pool.query(query, values);
    
        return {
          totalCount,
          totalPages,
          data: rows
        };
      } catch (error: any) {
        throw error;
      }
    }


  async deleteDrug(mydrugId: string, updateData: any): Promise<string> {
    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM mydrug WHERE mydrugid = $1
        RETURNING mydrugid, drugname, expiredat`;
      
      const values = [mydrugId];
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Drug not found');
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error executing query', err.stack);
        throw new Error('Failed to delete drug: ' + err.message);
      } else {
        console.error('Unknown error', err);
        throw new Error('Failed to delete drug due to an unknown error');
      }
    } finally {
      client.release();
    }
  }
    

  }

module.exports = { MydrugService };
