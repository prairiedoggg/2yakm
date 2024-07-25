const { addMyDrug, updateMyDrug, getMyDrugs, deleteMyDrug } = require('../controllers/mydrugController')

const express = require('express');
const router = express.Router();

router.post('/:userid', addMyDrug)
router.put('/:mydrugid', updateMyDrug)
router.get('/:userid', getMyDrugs)
router.delete('/:mydrugid', deleteMyDrug)

export default router;
