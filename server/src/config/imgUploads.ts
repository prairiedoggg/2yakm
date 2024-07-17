const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3'); 

// AWS S3 설정
const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// 메모리 상에서만 사용하는 multer 설정
const uploadToMemory = multer({ storage: multer.memoryStorage() });

// S3에 업로드하는 multer 설정
const uploadToS3 = multer({
  storage: multerS3 ({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req: any, file: { fieldname: any; }, cb: (arg0: null, arg1: { fieldName: any; }) => void) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

module.exports = {
  uploadToMemory,
  uploadToS3
};