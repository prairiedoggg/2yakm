const { getUserProfile, updateUsername, updateProfilePictureMemory, updateProfilePictureS3} = require('../controllers/mypageController');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const express = require('express');
const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', updateUsername);
router.put('/:id/profile-picture/memory', uploadToMemory.single('profilePicture'), updateProfilePictureMemory);
router.put('/:id/profile-picture/s3', uploadToS3.single('profilePicture'), updateProfilePictureS3);

module.exports = router;
