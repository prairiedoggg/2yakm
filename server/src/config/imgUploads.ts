import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

// AWS S3 설정
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION
});

// 메모리 상에서만 사용하는 multer 설정
export const uploadToMemory = multer({ storage: multer.memoryStorage() });

// S3에 업로드하는 multer 설정
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    metadata: function (
      req: any,
      file: { fieldname: any },
      cb: (arg0: null, arg1: { fieldName: any }) => void
    ) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (
      req: any,
      file: { originalname: any },
      cb: (arg0: null, arg1: string) => void
    ) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.fieldname === 'calImg' || file.fieldname === 'profileImg') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
  }
});