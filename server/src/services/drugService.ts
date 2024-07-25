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

const getDrugs = async (limit: number, offset: number, sortedBy: string, order: string): Promise<any> => {
  const countQuery = `SELECT COUNT(*) AS total FROM drugs`;
  const countResults = await pool.query(countQuery);
  const totalCount = parseInt(countResults.rows[0].total, 10);
  const totalPages = Math.ceil(totalCount / limit);

  const query = `
    SELECT 
      drugid, drugname, drugengname, companyname, companyengname, ingredientname, ingredientengname, efficacy, howtouse, caution, cautionwarning, 
      interaction, sideeffect, storagemethod, created_at
    FROM 
      drugs
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

const getDrugById = async (drugid: number): Promise<any> => {
  const query = 'SELECT * FROM drugs WHERE drugid = $1';
  const result = await pool.query(query, [drugid]);
  return result.rows[0];
};

const updateDrug = async (drugid: number, drugData: any): Promise<any> => {
  const {
    drugname,
    drugengname,
    companyname,
    companyengname,
    ingredientname,
    ingredientengname,
    efficacy,
    howtouse,
    caution,
    cautionwarning,
    interaction,
    sideeffect,
    storagemethod,
  } = drugData;

  const query = `UPDATE drugs SET 
    drugname=$2, drugengname=$3, companyname=$4, companyengname=$5, ingredientname=$6, ingredientengname=$7, efficacy=$8, howtouse=$9, caution=$10, 
    cautionwarning=$11, interaction=$12, sideeffect=$13, storagemethod=$14 
    WHERE drugid = $1 RETURNING *`;

  const values = [
    drugid,
    drugname,
    drugengname,
    companyname,
    companyengname,
    ingredientname,
    ingredientengname,
    efficacy,
    howtouse,
    caution,
    cautionwarning,
    interaction,
    sideeffect,
    storagemethod,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteDrug = async (drugid: number): Promise<boolean> => {
  const query = 'DELETE FROM drugs WHERE drugid = $1';
  const result = await pool.query(query, [drugid]);
  return result.rowCount > 0;
};


const searchDrugsbyName = async (drugname: string, limit: number, offset: number) => {
  const query = 'SELECT * FROM drugs WHERE drugname ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
  const values = [`%${drugname}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      drugs: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search drugs by name: ${error.message}`);
    } else {
      throw new Error('Failed to search drugs by name: An unknown error occurred');
    }
  }
};

const searchDrugsbyEngName = async (drugname: string, limit: number, offset: number) => {
  const query = 'SELECT * FROM drugs WHERE drugengname ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
  const values = [`%${drugname}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      drugs: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search drugs by name: ${error.message}`);
    } else {
      throw new Error('Failed to search drugs by name: An unknown error occurred');
    }
  }
};

const searchDrugsbyEfficacy = async (efficacy: string, limit: number, offset: number) => {
  const efficacyArray = efficacy.split(',').map(eff => `%${eff.trim()}%`);
  const query = `
      SELECT * 
      FROM drugs 
      WHERE ${efficacyArray.map((_, index) => `efficacy ILIKE $${index + 1}`).join(' AND ')} 
      ORDER BY created_at DESC 
      LIMIT $${efficacyArray.length + 1} OFFSET $${efficacyArray.length + 2}`;
  const values = [...efficacyArray, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      drugs: result.rows,
      total: result.rowCount,
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search drugs by efficacy: ${error.message}`);
    } else {
      throw new Error('Failed to search drugs by efficacy: An unknown error occurred');
    }
  }
};

const searchDrugsByFrontAndBack = async (front: string, back:string, limit: number, offset: number) => {
  const query = `
  SELECT * 
  FROM pillocr 
  WHERE front = $1 AND back = $2
  LIMIT $3 OFFSET $4`;
const values = [front, back, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      drugs: result.rows,
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
        .filter(text => !text.match(/[\d\.()]/) && !text.includes('밀리그람') && !text.includes('의약품'))

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

const searchDrugsByImage = async (imageBuffer: Buffer, limit: number, offset: number) => {
  try {
    const detectedText = await detectTextInImage(imageBuffer);
    if (!detectedText || detectedText.length === 0) {
      return { drugs: [], total: 0, limit, offset };
    }

    let pills: PillData[] = [];
    let total = 0;

    for (const text of detectedText) {
      if (text) {  // Ensure text is not null or undefined
        const frontText = detectedText[0];
        const backText = detectedText[1];
        const resultByFrontAndBack = await searchDrugsByFrontAndBack(frontText, backText, limit, offset);
        pills.push(...resultByFrontAndBack.drugs);
        total += resultByFrontAndBack.total;
      }
    }

    // Remove duplicates based on drugid
    const uniqueDrugs = Array.from(new Map(pills.map(pill => [pill.id, pill])).values());

    return {
      drugs: uniqueDrugs,
      total: uniqueDrugs.length,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error searching drugs by image:', error);
    throw new Error('Failed to search drugs by image.');
  }
};

export {
  getDrugs,
  getDrugById,
  updateDrug,
  deleteDrug,
  searchDrugsbyName,
  searchDrugsbyEfficacy,
  searchDrugsByImage,
  searchDrugsbyEngName  
};