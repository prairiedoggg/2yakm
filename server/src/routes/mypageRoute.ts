const { getUserProfile, updateUserProfile, updateProfilePicture, upload } = require('../controllers/mypage_controller');
const express = require('express');
const router = express.Router();

router.get('/mypage/:id', getUserProfile);
router.put('/mypage/:id', updateUserProfile);
router.post('/mypage/:id/profile-picture', upload.single('profilePicture'), updateProfilePicture);

module.exports = router;
