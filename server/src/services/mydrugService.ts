const { pool } = require('../db');

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
        INSERT INTO mydrug (mydrugid, userid, drugname, expiredat)
        VALUES ($1, $2, $3, $4) RETURNING drugname, expiredat`;
      
        const values = [mydrugId, userId, updateData.drugname, updateData.expiredat];
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
        `UPDATE mydrug SET drugname = $1, expiredat = $2 WHERE mydrugid = $3 
        RETURNING mydrugid, drugname, expiredat`,
        [updateData.drugname, updateData.expiredat, mydrugId]
      );
    
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0];
    }

    async getDrugs(userId: string, offset: number, limit: number): Promise<any[]> {
      const client = await pool.connect();
  
      try {
        const query = `
          SELECT mydrugid, drugname, expiredat FROM mydrug
          WHERE userid = $1
          ORDER BY drugname ASC
          OFFSET $2 LIMIT $3`;
  
        const values = [userId, offset, limit];
        const result = await client.query(query, values);
  
        return result.rows;
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error executing query', err.stack);
          throw new Error('Failed to get drugs: ' + err.message);
        } else {
          console.error('Unknown error', err);
          throw new Error('Failed to get drugs due to an unknown error');
        }
      } finally {
        client.release();
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
