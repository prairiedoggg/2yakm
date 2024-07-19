const express = require('express');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const uploadController = require('../controllers/upload-controller');

const router = express.Router();

router.post('/memory', uploadToMemory.single('image'), uploadController.uploadImageToMemory);
router.post('/s3', uploadToS3.single('image'), uploadController.uploadImageToS3);

module.exports = router;