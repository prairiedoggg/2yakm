const express = require('express');
const { uploadToMemory, uploadToS3 } = require('../config/imgUploads');
const drugController = require('../controllers/drugController');
const router = express.Router();

router.get('/', drugController.getDrugsHandler);
router.get('/:drugid', drugController.getDrugByIdHandler);
router.put('/:drugid', drugController.updateDrugHandler);
router.delete('/:drugid', drugController.deleteDrugHandler);
router.get('/:drugid/count', drugController.getPillFavoriteCount);

router.get('/search/name', drugController.searchDrugsbyNameHandler);
router.get('/search/engname', drugController.searchDrugsbyEngNameHandler);
router.get('/search/efficacy', drugController.searchDrugsbyEfficacyHandler);
router.get('/search/image', uploadToMemory.single('image'), drugController.searchDrugsByImageHandler);

export default router;


   
