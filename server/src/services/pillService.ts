import { pool } from '../db';
import { createError } from '../utils/error';
import vision from '@google-cloud/vision';
const { execFile } = require('child_process');
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import iconv from 'iconv-lite';
import { stopwords } from '../utils/stopwords';


const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

interface Pills {
  id: number;
  name: string;
  engname: string;
  companyname: string;
  ingredientname: string;
  efficacy: string;
  importantWords?: string; // Optional to hold important words extracted from efficacy
}

interface GetPillsResult {
  totalCount: number;
  totalPages: number;
  pills: Pills[];
  limit: number;
  offset: number;
}

interface SearchResult {
  pills: Pills[];
  totalCount: number;
  totalPages: number;
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
    pills: rows,
    limit,
    offset,
  };
};

export const getPillById = async (id: number): Promise<Pills | null> => {
  const query = 'SELECT id, name, engname, companyname, ingredientname, efficacy FROM pills WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const getImportantWords = (text: string): string[] => {
  console.log(`Original text: ${text}`);
  const wordFrequency: { [key: string]: number } = {};
  const priorityWordsSet = new Set(stopwords);
  const words = text
    .toLowerCase()
    .split(/[\s,.;:ㆍ()]+/)
    .filter(word => {
      const isValid = word && priorityWordsSet.has(word);
      console.log(`Word: ${word}, isValid: ${isValid}`);
      return isValid;
    });

  words.forEach(word => {
    if (!wordFrequency[word]) {
      wordFrequency[word] = 0;
    }
    wordFrequency[word]++;
  });

  console.log(`Word frequency: ${JSON.stringify(wordFrequency)}`);

  const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
  const importantWords = sortedWords.slice(0, 3).map(entry => entry[0]);
  console.log(`Important words: ${importantWords}`);
  return importantWords;
};

export const searchPillsbyName = async (
  name: string,
  limit: number,
  offset: number
): Promise<GetPillsResult> => {
  const query = `SELECT id, name, engname, companyname, ingredientname, efficacy FROM pills WHERE name LIKE $1 OR engname LIKE $1 
                 LIMIT $2 OFFSET $3`;
  const values = [`${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);

    const pills = result.rows.map((pill: Pills) => {
      const importantWords = getImportantWords(pill.efficacy);
      console.log(`Pill ID: ${pill.id}, Important Words: ${importantWords}`);
      return {
        ...pill,
        importantWords: importantWords.join(', '),
      };
    });

    return {
      pills,
      totalCount: result.rowCount ?? 0,
      totalPages: Math.ceil((result.rowCount ?? 0) / limit),
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError('DatabaseError', `Failed to search pills by name: ${error.message}`, 500);
    } else {
      throw createError('UnknownError', `Failed to search pills by name: An unknown error occurred`, 500);
    }
  }
};

export const searchPillsbyEfficacy = async (
  efficacy: string,
  limit: number,
  offset: number
): Promise<GetPillsResult> => {
  const efficacyArray = efficacy.split(',').map((eff) => `%${eff.trim()}%`);
  const query = `
    SELECT id, name, engname, companyname, ingredientname, efficacy 
    FROM pills 
    WHERE ${efficacyArray
      .map((_, index) => `efficacy ILIKE $${index + 1}`)
      .join(' AND ')}  
    LIMIT $${efficacyArray.length + 1} OFFSET $${efficacyArray.length + 2}`;
  const values = [...efficacyArray, limit, offset];

  try {
    const result = await pool.query(query, values);

    const pills = result.rows.map((pill: Pills) => {
      const importantWords = getImportantWords(pill.efficacy);
      return {
        ...pill,
        importantWords: importantWords.join(', '),
      };
    });

    return {
      pills,
      totalCount: result.rowCount ?? 0,
      totalPages: Math.ceil((result.rowCount ?? 0) / limit),
      limit,
      offset,
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
): Promise<GetPillsResult> => {
  const query = `
    SELECT id, name, front, back 
    FROM pillocr 
    WHERE front = $1 AND back = $2
    LIMIT $3 OFFSET $4`;

  const values = [front, back, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      totalCount: result.rowCount ?? 0,
      totalPages: Math.ceil((result.rowCount ?? 0) / limit),
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError('DatabaseError', `${error.message}`, 500);
    } else {
      throw createError('UnknownError', 'An unknown error occurred', 500);
    }
  }
};

const searchPillsByNameFromText = async (
  text: string,
  limit: number,
  offset: number
): Promise<GetPillsResult> => {
  const query = `
    SELECT id, name, engname, companyname, ingredientname, efficacy 
    FROM pills 
    WHERE engname ILIKE $1
    LIMIT $2 OFFSET $3`;

  const values = [`${text}%`, limit, offset];

  try {
    const result = await pool.query(query, values);
    return {
      pills: result.rows,
      totalCount: result.rowCount ?? 0,
      totalPages: Math.ceil((result.rowCount ?? 0) / limit),
      limit,
      offset,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError('DatabaseError', `${error.message}`, 500);
    } else {
      throw createError('UnknownError', 'An unknown error occurred', 500);
    }
  }
};

const execFilePromise = promisify(execFile);

const preprocessImage = async (
  imageBuffer: Buffer
): Promise<{ processedImageBuffer: Buffer; processedImagePath: string }> => {
  const uniqueId = uuidv4();
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const inputPath = path.join(uploadsDir, `input_image_${uniqueId}.jpg`);
  const outputPath = path.join(uploadsDir, `processed_image_${uniqueId}.png`);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  fs.writeFileSync(inputPath, imageBuffer);

  const pyPath = path.join(__dirname, '..', 'python', 'removeBackground.py');
  const command = [pyPath, inputPath, outputPath]; // 파이썬 command 생성

  const startTime = Date.now();
  try {
    const { stdout, stderr } = await execFilePromise('python',
      command,
      {
        encoding: 'buffer'
      }
);
    // stdout, stderr 한글 깨짐 현상 수정
    const decodedStdout = iconv.decode(stdout, 'euc-kr');
    const decodedStderr = iconv.decode(stderr, 'euc-kr');

    if (decodedStderr) {
      console.error(`stderr: ${decodedStderr}`); // standard error, 에러 출력됨
    }
    console.log(`stdout: ${decodedStdout}`); // standard output, 전처리 결과가 출력됨
    console.log(
      `전처리가 완료되었습니다. 작업시간 : ${(Date.now() - startTime) / 1000}초`
    );
    const processedImageBuffer = fs.readFileSync(outputPath); // 처리된 이미지를 읽어와서 processedImageBuffer로 초기화
    return { processedImageBuffer, processedImagePath: outputPath }; // 처리된 이미지와, 경로를 반환함
  } catch (error: any) {
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
      const filteredText = detections
        .map((text) => text?.description ?? '')
        .filter((text) => !text.match(/[\.()]/) && !text.includes('mm') && !text.includes('-') && !text.includes('\n'));

      console.log('Filtered text:', filteredText);
      return filteredText;
    }
    console.log('No text detected');
    return [];
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
): Promise<GetPillsResult> => {
  let outputPath = '';

  try {
    const { processedImageBuffer, processedImagePath } = await preprocessImage(
      imageBuffer
    );
    outputPath = processedImagePath;
    const detectedText = await detectTextInImage(processedImageBuffer);
    if (!detectedText || detectedText.length === 0) {
      return { pills: [], totalCount: 0, totalPages: 0, limit, offset };
    }

    let pills: Pills[] = [];
    let total = 0;

    // First try with detectedText[0] as front and detectedText[1] as back
    const frontText1 = detectedText[0] || '';
    const backText1 = detectedText[1] || '';

    let resultByFrontAndBack = await searchPillsByFrontAndBack(
      frontText1,
      backText1,
      limit,
      offset
    );

    pills.push(...resultByFrontAndBack.pills);
    total += resultByFrontAndBack.totalCount;

    if (total === 0) {
      const frontText2 = detectedText[1] || '';
      const backText2 = detectedText[2] || '';

      resultByFrontAndBack = await searchPillsByFrontAndBack(
        frontText2,
        backText2,
        limit,
        offset
      );

      pills.push(...resultByFrontAndBack.pills);
      total += resultByFrontAndBack.totalCount;
    }
    
    // If no results from pillocr, search in pills table by name
    if (total === 0) {
    const text1 = detectedText[0];
        if (text1) {
          const resultByName = await searchPillsByNameFromText(
            text1,
            limit,
            offset
          );
          pills.push(...resultByName.pills);
          total += resultByName.totalCount;
        }

    const text2 = detectedText[1];
        if (text2) {
          const resultByName = await searchPillsByNameFromText(
            text2,
            limit,
            offset
          );
          pills.push(...resultByName.pills);
          total += resultByName.totalCount;
        }
      }


    // Remove duplicates based on id
    const uniquePills = Array.from(
      new Map(pills.map((pill) => [pill.id, pill])).values()
    );
    const uniquePillNames = uniquePills.map(pill => pill.name);
    const detailedPills = await Promise.all(
      uniquePillNames.map(async (name) => {
        const result = await searchPillsbyName(name, limit, offset);
        return result.pills;
      })
    ).then(results => results.flat());

    return {
      pills: detailedPills,
      totalCount: detailedPills.length,
      totalPages: Math.ceil(detailedPills.length / limit),
      limit,
      offset
    };
  } catch (error) {
    console.error('Error searching pills by image:', error);
    throw createError('SearchError', 'Failed to search pills by image.', 500);
  } finally {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
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
      WHERE pillid = $1
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
