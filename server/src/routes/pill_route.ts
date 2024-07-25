const express = require('express');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const pillController = require('../controllers/pillController');
const router = express.Router();

router.get('/', pillController.getPillsHandler);
router.get('/:id', pillController.getPillByIdHandler);
router.put('/:id', pillController.updatePillHandler);
router.delete('/:id', pillController.deletePillHandler);
router.get('/:id/reviewcount', pillController.getPillReviewCount);
router.get('/:id/favoritecount', pillController.getPillFavoriteCount);
router.get('/search/name', pillController.searchPillsbyNameHandler);
router.get('/search/engname', pillController.searchPillsbyEngNameHandler);
router.get('/search/efficacy', pillController.searchPillsbyEfficacyHandler);
router.get('/search/image', uploadToMemory.single('image'), pillController.searchPillsByImageHandler);

export default router;


   
