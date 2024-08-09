import { pool } from '../db';
import { createError } from '../utils/error';
import vision from '@google-cloud/vision';
const { execFile } = require('child_process');
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import iconv from 'iconv-lite';
import { QueryResult } from 'pg';
import { stopwords } from '../utils/stopwords';

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

interface Pills {
  id: number;
  name: string;
  engname: string;
  companyname: string;
  ingredientname: string;
  efficacy: string;
  importantWords?: string; // Optional to hold important words extracted from efficacy
  similarity?: string;
  dosage: string;
  caution: string;
  storagemethod: string;
  imgurl: string;
}

interface GetPillsResult {
  totalCount: number;
  totalPages: number;
  pills: Pills[];
  limit: number;
  offset: number;
  similarPills?: { id: string }[];
}

interface ExecFileResult {
  stdout: Buffer;
  stderr: Buffer;
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
    offset
  };
};

export const getPillById = async (id: number): Promise<Pills | null> => {
  const query =
    'SELECT id, name, engname, companyname, ingredientname, type, efficacy, dosage, caution, storagemethod, source, imgurl, boxurl FROM pills WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

interface ImportantWord {
  word: string;
  department: string;
}

const getImportantWords = (text: string): ImportantWord[] => {
  const wordFrequency: { [key: string]: number } = {};

  const words = text
    .toLowerCase()
    .split(/[\s,.;:ㆍ()]+/)
    .filter((word) => {
      const isValid =
        word &&
        Object.keys(stopwords).some((stopword) => word.includes(stopword));
      return isValid;
    });

  words.forEach((word) => {
    const stopword = Object.keys(stopwords).find((sw) => word.includes(sw));
    if (stopword) {
      wordFrequency[stopword] = (wordFrequency[stopword] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
  const importantWords = sortedWords.slice(0, 3).map(([word]) => ({
    word,
    department: stopwords[word]
  }));

  return importantWords;
};

export const searchPillsbyName = async (
  name: string,
  limit: number,
  offset: number
): Promise<GetPillsResult> => {
  const query = `SELECT id, name, engname, companyname, ingredientname, type, efficacy, dosage, caution, storagemethod, source, imgurl, boxurl 
                 FROM pills 
                 WHERE name ILIKE $1 OR engname ILIKE $1
                 ORDER BY name collate "ko_KR.utf8"
                 LIMIT $2 OFFSET $3`;
  const values = [`${name}%`, limit, offset];

  try {
    const result = await pool.query(query, values);

    const pills = result.rows.map((pill: Pills) => {
      const importantWordsWithDepartments = getImportantWords(pill.efficacy);
      const importantWords = importantWordsWithDepartments
        .map((iw) => iw.word)
        .join(', ');
      const departments = importantWordsWithDepartments
        .map((iw) => iw.department)
        .filter((dep) => dep)
        .join(', ');
      return {
        ...pill,
        importantWords,
        departments
      };
    });

    const totalCount = result.rowCount ?? 0;

    return {
      pills,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      limit,
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('DatabaseError', error);
      throw createError(
        'DatabaseError',
        `Failed to search pills by name: ${error.message}`,
        500
      );
    } else {
      console.error('UnknownError', error);
      throw createError(
        'UnknownError',
        `Failed to search pills by name: An unknown error occurred`,
        500
      );
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
    SELECT p.id, p.name, p.engname, p.companyname, p.ingredientname, p.type, p.efficacy, p.dosage, p.caution, p.storagemethod, p.source, p.imgurl, p.boxurl,
           COALESCE(f.favorites_count, 0) AS favorites_count,
           COALESCE(r.reviews_count, 0) AS reviews_count
    FROM pills p
    LEFT JOIN (
      SELECT pillid, COUNT(*) AS favorites_count
      FROM favorites
      GROUP BY pillid
    ) f ON p.id = f.pillid
    LEFT JOIN (
      SELECT pillid, COUNT(*) AS reviews_count
      FROM reviews
      GROUP BY pillid
    ) r ON p.id = r.pillid
    WHERE ${efficacyArray
      .map((_, index) => `p.efficacy ILIKE $${index + 1}`)
      .join(' AND ')}  
    GROUP BY p.id, f.favorites_count, r.reviews_count
    ORDER BY favorites_count DESC, reviews_count DESC
    LIMIT $${efficacyArray.length + 1} OFFSET $${efficacyArray.length + 2}`;

  const values = [...efficacyArray, limit, offset];

  try {
    const result = await pool.query(query, values);

    const pills = result.rows
      .map((pill: Pills) => {
        const importantWordsWithDepartments = getImportantWords(pill.efficacy);
        const importantWords = importantWordsWithDepartments
          .map((iw) => iw.word)
          .join(', ');
        const departments = importantWordsWithDepartments
          .map((iw) => iw.department)
          .filter((dep) => dep)
          .join(', ');
        return {
          ...pill,
          importantWords,
          departments
        };
      })
      .filter((pill) => {
        const importantWordsArray = pill.importantWords
          .split(', ')
          .map((word) => word.trim().toLowerCase());
        const efficacyArrayToCheck = efficacy
          .split(',')
          .map((word) => word.trim().toLowerCase());

        return efficacyArrayToCheck.some((word) =>
          importantWordsArray.includes(word)
        );
      });

    return {
      pills,
      totalCount: pills.length,
      totalPages: Math.ceil((result.rowCount ?? 0) / limit),
      limit,
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('DatabaseError', error);
      throw createError(
        'DatabaseError',
        `Failed to search pills by efficacy: ${error.message}`,
        500
      );
    } else {
      console.error('UnknownError', error);
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
    SELECT id, name, front, back, imagepath 
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
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('DatabaseError', error);
      throw createError('DatabaseError', `${error.message}`, 500);
    } else {
      console.error('UnknownError', error);
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
    SELECT id, name, engname, companyname, ingredientname, type, efficacy, dosage, caution, storagemethod, source, imgurl, boxurl
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
      offset
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('DatabaseError', error);
      throw createError('DatabaseError', `${error.message}`, 500);
    } else {
      console.error('UnknownError', error);
      throw createError('UnknownError', 'An unknown error occurred', 500);
    }
  }
};

// execFile은 shell을 생성하지 않아 exec보다 더 효율적임, 비동기 명령어 실행을 async, await로 할 수 있게 promisify를 사용함
const execFilePromise = promisify(execFile);

const preprocessImage = async (
  imageBuffer: Buffer[]
): Promise<{ processedImageBuffer: Buffer; processedImagePath: string }> => {
  const preprocessId = uuidv4();
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const inputPath = imageBuffer.map((_, idx) =>
    path.join(uploadsDir, `input_image_${preprocessId}_${idx + 1}.png`)
  );
  const mergedInputPath = path.join(
    uploadsDir,
    `merged_image_${preprocessId}.png`
  );
  const outputPath = path.join(
    uploadsDir,
    `processed_image_${preprocessId}.png`
  );

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // 따로 객체를 반환할 필요가 없으므로 forEach를 사용함 (forEach의 반환값은 언제나 undefined)
  imageBuffer.forEach((buffer, idx) => {
    const filePath = inputPath[idx];
    fs.writeFileSync(filePath, buffer); // buffer 이미지를 filePath에 저장함
  });

  let command: string[];

  const pyPath = path.join(__dirname, '..', 'python', 'removeBackground.py');

  if (imageBuffer.length === 2) {
    command = [pyPath, ...inputPath, outputPath];
  } else if (imageBuffer.length === 1) {
    command = [pyPath, inputPath[0], outputPath];
  } else {
    throw new Error('이미지 개수를 확인해주세요.');
  }

  const startTime = Date.now();
  try {
    const { stdout, stderr }: ExecFileResult = await execFilePromise(
      'python',
      command,
      {
        encoding: 'buffer'
      }
    ); // execFilePromise를 사용하여 Python 스크립트를 실행함, buffer 형태로 인코딩해야 iconv로 변환할 수 있음

    // stdout, stderr 한글 깨짐 현상 수정
    const decodedStdout = iconv.decode(stdout, 'euc-kr');
    const decodedStderr = iconv.decode(stderr, 'euc-kr');

    if (decodedStderr) {
      console.error(`stderr: ${decodedStderr}`); // standard error, 에러 출력됨
    }
    console.log(`stdout: ${decodedStdout}`); // standard output, 결과가 출력됨
    console.log(
      `전처리가 완료되었습니다. 작업시간 : ${(Date.now() - startTime) / 1000}초`
    );
    const processedImageBuffer = fs.readFileSync(outputPath); // 처리된 이미지를 읽어와서 processedImageBuffer로 초기화
    return { processedImageBuffer, processedImagePath: outputPath }; // 처리된 이미지와, 경로를 반환함
  } catch (error: any) {
    console.error('이미지 전처리 중 에러가 발생했습니다.', error);
    throw createError('Preprocessing Failed', '이미지 전처리 실패', 500);
  } finally {
    inputPath.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });
    if (fs.existsSync(mergedInputPath)) {
      fs.unlinkSync(mergedInputPath);
    }
  }
};

// 유사도 검색 결과에서 받아온 id를 이용해 DB에서 정보를 받아오는 함수
const searchSimilarImageByIds = async (ids: string[]): Promise<Pills[]> => {
  const query = `SELECT id, name, engname, companyname, ingredientname, efficacy, dosage, caution, storagemethod, source, imgurl, boxurl FROM pills WHERE id = ANY($1)`;
  const result: QueryResult<Pills> = await pool.query(query, [ids]);
  return result.rows;
};

// 이미지 유사도를 검색하는 함수
const searchSimilarImage = async (
  imagePath: string
): Promise<{
  similarPills: { id: string; similarity: string }[];
}> => {
  const pyPath = path.join(__dirname, '..', 'python', 'imageVector.py');

  // 유사도를 추출하기 위해서 임시로 txt파일을 생성함
  const outputResultPath = path.join(
    __dirname,
    '..',
    'python',
    `temp_${uuidv4()}.txt`
  );
  const command = [pyPath, imagePath, outputResultPath]; // 파이썬 command 설정

  try {
    const { stdout, stderr }: ExecFileResult = await execFilePromise(
      'python',
      command,
      { encoding: 'buffer' }
    );

    // stdout, stderr 한글 깨짐 현상 수정
    const decodedStdout = iconv.decode(stdout, 'euc-kr');
    const decodedStderr = iconv.decode(stderr, 'euc-kr');

    if (decodedStderr) {
      console.error(`stderr: ${decodedStderr}`); // standard error, 에러 출력됨
    }
    console.log(`stdout: ${decodedStdout}`); // standard output, 결과가 출력됨

    // txt 파일에서 유사도를 읽어온 후에 삭제함
    const result = fs.readFileSync(outputResultPath, 'utf-8');
    fs.unlinkSync(outputResultPath);

    const lines = result.trim().split('\n'); // 줄 단위로 자름

    const similarPills = lines.map((line) => {
      const [fullPath, similarity] = line.split(' ('); // 이미지 경로와 유사도를 분리함
      const fileName = path.basename(fullPath).split('.')[0]; // 파일명만 추출하고 확장자를 제거함
      const id = fileName.replace(/^processed_image_\d+\\/, ''); // mac, linux에서 \\ 두개가 생기는 문제 해결
      return {
        id,
        similarity: similarity.replace(')', '').replace('\r', '')
      };
    });

    return {
      similarPills
    };
  } catch (error) {
    console.error('이미지 유사도 검색 중 에러가 발생했습니다.', error);
    throw createError(
      'SimilaritySearch Failed',
      '이미지 유사도 검색 실패',
      500
    );
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
        .filter((text) => !text.match(/[\.()]/) && !text.includes('-'));

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
  imageBuffer: Buffer[],
  limit: number,
  offset: number
): Promise<GetPillsResult> => {
  let outputPath = '';

  try {
    const { processedImageBuffer, processedImagePath } =
      await preprocessImage(imageBuffer); // preprocessImage를 이용해 전처리를 하고 전처리된 이미지와, 경로를 받아옴
    outputPath = processedImagePath;
    const detectedText = await detectTextInImage(processedImageBuffer);

    // 추출된 텍스트가 없을 경우 이미지 유사도 검색을 실행함
    if (!detectedText || detectedText.length === 0) {
      console.log('OCR 검색 결과가 없습니다. 이미지 유사도 검색을 시작합니다.');

      const { similarPills } = await searchSimilarImage(outputPath);

      const similarPillIds = similarPills.map((pill) => pill.id);

      // 유사도 검색 결과에서 받아온 id를 이용해 DB에서 정보를 받아옴
      let pills = await searchSimilarImageByIds(similarPillIds);

      // id가 같은 pill data와 유사도를 합침
      pills = pills.map((pill) => {
        const similarityInfo = similarPills.find(
          (similarPill) => similarPill.id === pill.id.toString()
        );
        return {
          ...pill,
          similarity: similarityInfo ? similarityInfo.similarity : '0%'
        };
      });

      // 유사도가 높은 순으로 정렬함
      pills.sort((a, b) => {
        const similarityA = a.similarity
          ? parseFloat(a.similarity.replace('%', ''))
          : 0;
        const similarityB = b.similarity
          ? parseFloat(b.similarity.replace('%', ''))
          : 0;
        return similarityB - similarityA;
      });

      return {
        pills,
        totalCount: pills.length,
        totalPages: Math.ceil(pills.length / limit),
        limit,
        offset
      };
    }

    if (detectedText[0].includes('\n')) {
      const temp = detectedText[0].split('\n');
      detectedText[0] = temp[0];
      detectedText[1] = temp[1];
    }

    console.log('Detected Text:', detectedText);

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
    const uniquePillNames = uniquePills.map((pill) => pill.name);
    const detailedPills = await Promise.all(
      uniquePillNames.map(async (name) => {
        const result = await searchPillsbyName(name, limit, offset);
        return result.pills;
      })
    ).then((results) => results.flat());

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
    console.error('DatabaseError', error);
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
    console.error('DatabaseError', error);
    throw createError(
      'DatabaseError',
      `Failed to get review count: ${error.message}`,
      500
    );
  }
};
