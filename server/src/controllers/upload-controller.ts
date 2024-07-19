const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');

const uploadImageToMemory = (req: any, res: any) => {
  res.status(200).json({ message: 'Image uploaded to memory successfully', file: req.file });
};

const uploadImageToS3 = (req: any, res: any) => {
  res.status(200).json({ message: 'Image uploaded to S3 successfully', file: req.file });
};

module.exports = {
  uploadImageToMemory,
  uploadImageToS3,
};