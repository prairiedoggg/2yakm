const { getUserProfile, updateUserProfile, updateProfilePicture} = require('../controllers/mypageController');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const express = require('express');
const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.post('/:id/profile-picture', uploadToMemory.single('profilePicture'), updateProfilePicture);
router.post('/:id/profile-picture', uploadToS3.single('profilePicture'), updateProfilePicture);

module.exports = router;
