const { pool } = require('../db');
import { createError } from '../utils/error';
import vision from '@google-cloud/vision';
const { execFile } = require('child_process');
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

interface PillData {
  id: number;
  name: string;
  front: string;
  back: string;
  shape: string;
  imagepath: string;
  favoriteCount: number;
}

interface GetPillsResult {
  totalCount: number;
  totalPages: number;
  data: PillData[];
}

interface SearchResult {
  pills: PillData[];
  total: number;
  limit: number;
  offset: number;
}

export const getPills = async (
  limit: number,
  offset: number,
  sortedBy: string,
  order: string
): Promise<GetPillsResult> => {
  const countQuery = `SELECT COUNT(*) AS total FROM pills`;
  const countResults = await pool.query(countQuery);
  const totalCount = parseInt(countResults.rows[0].total, 10);
  const totalPages = Math.ceil(totalCount / limit);

  const query = `
    SELECT pills.*, COALESCE(favorite_counts.count, 0) as favorite_count
    FROM pills
    LEFT JOIN (
      SELECT id, COUNT(*) AS count
      FROM favorites
      GROUP BY id
    ) AS favorite_counts ON pills.id = favorite_counts.id
    ORDER BY ${
      sortedBy === 'favorite_count' ? 'favorite_count' : `pills.${sortedBy}`
    } ${order}
    LIMIT $1 OFFSET $2`;

  const values = [limit, offset];
  const { rows } = await pool.query(query, values);

  return {
    totalCount,
    totalPages,
    data: rows
  };
};

export const getPillById = async (id: number): Promise<PillData | null> => {
  const query = 'SELECT * FROM pills WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const searchPillsbyName = async (
  name: string,
  limit: number,
  offset: number
): Promise<SearchResult> => {
  const query = 'SELECT * FROM pills WHERE name ILIKE $1 LIMIT $2 OFFSET $3';
  const values = [`${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError(
        'DatabaseError',
        `Failed to search pills by name: ${error.message}`,
        500
      );
    } else {
      throw createError(
        'UnknownError',
        'Failed to search pills by name: An unknown error occurred',
        500
      );
    }
  }
};

export const searchPillsbyEngName = async (
  name: string,
  limit: number,
  offset: number
): Promise<SearchResult> => {
  const query = 'SELECT * FROM pills WHERE engname ILIKE $1 LIMIT $2 OFFSET $3';
  const values = [`${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError(
        'DatabaseError',
        `Failed to search pills by name: ${error.message}`,
        500
      );
    } else {
      throw createError(
        'UnknownError',
        'Failed to search pills by name: An unknown error occurred',
        500
      );
    }
  }
};

export const searchPillsbyEfficacy = async (
  efficacy: string,
  limit: number,
  offset: number
): Promise<SearchResult> => {
  const efficacyArray = efficacy.split(',').map((eff) => `%${eff.trim()}%`);
  const query = `
    SELECT * 
    FROM pills 
    WHERE ${efficacyArray
      .map((_, index) => `efficacy ILIKE $${index + 1}`)
      .join(' AND ')}  
    LIMIT $${efficacyArray.length + 1} OFFSET $${efficacyArray.length + 2}`;
  const values = [...efficacyArray, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      total: result.rowCount,
      limit,
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError(
        'DatabaseError',
        `Failed to search pills by efficacy: ${error.message}`,
        500
      );
    } else {
      throw createError(
        'UnknownError',
        'Failed to search pills by efficacy: An unknown error occurred',
        500
      );
    }
  }
};

const searchPillsByFrontAndBack = async (
  front: string,
  back: string,
  limit: number,
  offset: number
): Promise<SearchResult> => {
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
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError('DatabaseError', `${error.message}`, 500);
    } else {
      throw createError('UnknownError', 'An unknown error occurred', 500);
    }
  }
};

// execFile은 shell을 생성하지 않아 exec보다 더 효율적임, 비동기 명령어 실행을 async, await로 할 수 있게 promisify를 사용함
const execFilePromise: (
  file: string,
  args: string[]
) => Promise<{ stdout: string; stderr: string }> = promisify(execFile);

// 이미지 배경을 제거하는 함수
const preprocessImage = async (
  imageBuffer: Buffer
): Promise<{ processedImageBuffer: Buffer; processedImagePath: string }> => {
  const uniqueId = uuidv4();
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const inputPath = path.join(uploadsDir, `input_image_${uniqueId}.jpg`);
  const outputPath = path.join(uploadsDir, `processed_image_${uniqueId}.png`);

  // 업로드 디렉터리가 존재하지 않으면 생성해줌
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  fs.writeFileSync(inputPath, imageBuffer);

  // RMBG-1.4 모델을 불러옴
  const pyPath = path.join(__dirname, '..', 'python', 'removeBackground.py');
  const command = [pyPath, inputPath, outputPath]; // 파이썬 command 생성

  const startTime = Date.now();
  try {
    const { stdout, stderr } = await execFilePromise('python', command); // execFilePromise를 사용하여 Python 스크립트를 실행함
    if (stderr) {
      console.error(`stderr: ${stderr}`); // standard error, 에러 출력됨
    }
    console.log(`stdout: ${stdout}`); // standard output, 전처리 결과가 출력됨
    console.log(
      `전처리가 완료되었습니다. 작업시간 : ${(Date.now() - startTime) / 1000}초`
    );
    const processedImageBuffer = fs.readFileSync(outputPath); // 처리된 이미지를 읽어와서 processedImageBuffer로 초기화
    return { processedImageBuffer, processedImagePath: outputPath }; // 처리된 이미지와, 경로를 반환함
  } catch (error) {
    console.error('이미지 전처리 중 에러가 발생했습니다.', error);
    throw createError('Preprocessing Failed', '이미지 전처리 실패', 500);
  } finally {
    fs.unlinkSync(inputPath); // 입력 파일을 삭제함
  }
};

const detectTextInImage = async (
  imageBuffer: Buffer
): Promise<string[] | null> => {
  try {
    console.log('Detecting text in image...');
    const [result] = await client.textDetection({
      image: { content: imageBuffer }
    });
    console.log('Vision API result:', result);

    const detections = result.textAnnotations;
    if (detections && detections.length > 0) {
      // Remove numbers, dots, parentheses, square brackets
      const filteredText = detections
        .map((text) => text?.description ?? '')
        .filter((text) => !text.match(/[\d\.()]/));

      console.log('Filtered text:', filteredText);
      return filteredText;
    }
    console.log('No text detected');
    return null;
  } catch (error) {
    console.error('Error detecting text in image:', error);
    throw createError(
      'VisionAPIError',
      'Failed to detect text in the image.',
      500
    );
  }
};

export const searchPillsByImage = async (
  imageBuffer: Buffer,
  limit: number,
  offset: number
): Promise<SearchResult> => {
  let outputPath = '';

  try {
    const { processedImageBuffer, processedImagePath } = await preprocessImage(
      imageBuffer
    ); // preprocessImage를 이용해 전처리를 하고 전처리된 이미지와, 경로를 받아옴
    outputPath = processedImagePath;
    const detectedText = await detectTextInImage(processedImageBuffer);
    if (!detectedText || detectedText.length === 0) {
      return { pills: [], total: 0, limit, offset };
    }

    let pills: PillData[] = [];
    let total = 0;

    for (const text of detectedText) {
      if (text) {
        const frontText = detectedText[0];
        const backText = detectedText[1];
        const resultByFrontAndBack = await searchPillsByFrontAndBack(
          frontText,
          backText,
          limit,
          offset
        );
        pills.push(...resultByFrontAndBack.pills);
        total += resultByFrontAndBack.total;
      }
    }

    // Remove duplicates based on id
    const uniquePills = Array.from(
      new Map(pills.map((pill) => [pill.id, pill])).values()
    );

    return {
      pills: uniquePills,
      total: uniquePills.length,
      limit,
      offset
    };
  } catch (error) {
    console.error('Error searching pills by image:', error);
    throw createError('SearchError', 'Failed to search pills by image.', 500);
  } finally {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath); // OCR 과정이 끝나면 전처리된 파일을 삭제함
    }
  }
};

export const getPillFavoriteCountService = async (
  id: number
): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM favorites
      WHERE pillid = $1
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);

    return parseInt(rows[0].count, 10);
  } catch (error: any) {
    throw createError(
      'DatabaseError',
      `Failed to get favorite count: ${error.message}`,
      500
    );
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
    throw createError(
      'DatabaseError',
      `Failed to get review count: ${error.message}`,
      500
    );
  }
};
