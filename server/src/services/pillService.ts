const { pool } = require('../db');

import vision from '@google-cloud/vision';
import dotenv from 'dotenv';

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

dotenv.config();

interface PillData {
    id: number;
    name: string;
    front: string;
    back: string;
    shape: string;
    imagepath: string;
  }

export const getPills = async (limit: number, offset: number, sortedBy: string, order: string): Promise<any> => {
  const countQuery = `SELECT COUNT(*) AS total FROM pills`;
  const countResults = await pool.query(countQuery);
  const totalCount = parseInt(countResults.rows[0].total, 10);
  const totalPages = Math.ceil(totalCount / limit);

  const query = `
    SELECT * FROM pills
    ORDER BY ${sortedBy} ${order}
    LIMIT $1 OFFSET $2`;

  const values = [limit, offset];
  const { rows } = await pool.query(query, values);

  return {
    totalCount,
    totalPages,
    data: rows,
  };
};

export const getPillById = async (id: number): Promise<any> => {
  const query = 'SELECT * FROM pills WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/**
export const updatePill = async (id: number, pillData: any): Promise<any> => {
  const {
    name,
    engname,
    companyname,
    companyengname,
    ingredientname,
    ingredientengname,
    type,
    shape,
    efficacy,
    dosage,
    caution,
    cautionwarning,
    interaction,
    sideeffect,
    storagemethod,
  } = pillData;

  const query = `UPDATE pills SET 
    name=$2, engname=$3, companyname=$4, companyengname=$5, ingredientname=$6, ingredientengname=$7, type =$8 , shape =$9, efficacy=$10, dosage=$11, caution=$12, 
    cautionwarning=$13, interaction=$14 , sideeffect=$15, storagemethod=$16
    WHERE id = $1 RETURNING *`;

  const values = [
    id,
    name,
    engname,
    companyname,
    companyengname,
    ingredientname,
    ingredientengname,
    type,
    shape,
    efficacy,
    dosage,
    caution,
    cautionwarning,
    interaction,
    sideeffect,
    storagemethod
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
*/

/**
export const deletePill = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM pills WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
};
*/

export const searchPillsbyName = async (name: string, limit: number, offset: number) => {
  const query = 'SELECT * FROM pills WHERE name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
  const values = [`%${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search pills by name: ${error.message}`);
    } else {
      throw new Error('Failed to search pills by name: An unknown error occurred');
    }
  }
};

export const searchPillsbyEngName = async (name: string, limit: number, offset: number) => {
  const query = 'SELECT * FROM pills WHERE engname ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
  const values = [`%${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search pills by name: ${error.message}`);
    } else {
      throw new Error('Failed to search pills by name: An unknown error occurred');
    }
  }
};

export const searchPillsbyEfficacy = async (efficacy: string, limit: number, offset: number) => {
  const efficacyArray = efficacy.split(',').map(eff => `%${eff.trim()}%`);
  const query = `
      SELECT * 
      FROM pills 
      WHERE ${efficacyArray.map((_, index) => `efficacy ILIKE $${index + 1}`).join(' AND ')} 
      ORDER BY created_at DESC 
      LIMIT $${efficacyArray.length + 1} OFFSET $${efficacyArray.length + 2}`;
  const values = [...efficacyArray, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search pills by efficacy: ${error.message}`);
    } else {
      throw new Error('Failed to search pills by efficacy: An unknown error occurred');
    }
  }
};

const searchPillsByFrontAndBack = async (front: string, back:string, limit: number, offset: number) => {
  const query = `
  SELECT * 
  FROM pillocr 
  WHERE front = $1 AND back = $2
  LIMIT $3 OFFSET $4`;
  
  const values = [front, back, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};


const detectTextInImage = async (imageBuffer: Buffer) => {
  try {
    console.log('Detecting text in image...');
    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    console.log('Vision API result:', result);

    const detections = result.textAnnotations;
    if (detections && detections.length >= 0) {
      // Remove numbers, dots, parentheses, square brackets, one-character length elements, and elements containing '밀리그람' or '의약품'
      const filteredText = detections
        .map(text => text?.description ?? '')
        .filter(text => !text.match(/[\d\.()]/))

      console.log('Filtered text:', filteredText);
      return filteredText;
    }
    console.log('No text detected');
    return [];
  } catch (error) {
    console.error('Error detecting text in image:', error);
    throw new Error('Failed to detect text in the image.');
  }
};

export const searchPillsByImage = async (imageBuffer: Buffer, limit: number, offset: number) => {
  try {
    const detectedText = await detectTextInImage(imageBuffer);
    if (!detectedText || detectedText.length === 0) {
      return { pills: [], total: 0, limit, offset };
    }

    let pills: PillData[] = [];
    let total = 0;

    for (const text of detectedText) {
      if (text) {  // Ensure text is not null or undefined
        const frontText = detectedText[0];
        const backText = detectedText[1];
        const resultByFrontAndBack = await searchPillsByFrontAndBack(frontText, backText, limit, offset);
        pills.push(...resultByFrontAndBack.pills);
        total += resultByFrontAndBack.total;
      }
    }

    // Remove duplicates based on id
    const uniquePills = Array.from(new Map(pills.map(pill => [pill.id, pill])).values());

    return {
      pills: uniquePills,
      total: uniquePills.length,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error searching pills by image:', error);
    throw new Error('Failed to search pills by image.');
  }
};

export const getPillFavoriteCountService = async (
   id: number
 ): Promise<number> => {
   try {
     const query = `
   SELECT COUNT(*) AS count
   FROM favorites
   WHERE id = $1
   `;
     const values = [id];
     const { rows } = await pool.query(query, values);

     return parseInt(rows[0].count, 10);
   } catch (error: any) {
     throw error;
   }
 };


export const getPillReviewCountService = async (
  id: number
): Promise<number> => {
  try {
    const query = `
  SELECT COUNT(*) AS count
  FROM reviews
  WHERE id = $1
  `;
    const values = [id];
    const { rows } = await pool.query(query, values);

    return parseInt(rows[0].count, 10);
  } catch (error: any) {
    throw error;
  }
};

