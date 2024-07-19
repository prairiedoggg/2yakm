const { getUserProfile, updateUsername, updateProfilePictureMemory, updateProfilePictureS3} = require('../controllers/mypageController');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const express = require('express');
const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', updateUsername);


router.put('/:id/profile-picture/memory', uploadToMemory.single('profilePicture'), updateProfilePictureMemory);
router.put('/:id/profile-picture/s3', uploadToS3.single('profilePicture'), updateProfilePictureS3);

/*
 * uploadToMemory.single 또는 uploadToS3.single을 이용할 때는 req.body의 key값을 'profilePicture'로 하고, value를 이미지 파일로 하면 됩니다.
*/

module.exports = router;
