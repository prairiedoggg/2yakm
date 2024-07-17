const { getUserProfile, updateUserProfile, updateProfilePicture, upload } = require('../controllers/mypageController');
const express = require('express');
const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.post('/:id/profile-picture', upload.single('profilePicture'), updateProfilePicture);

module.exports = router;
