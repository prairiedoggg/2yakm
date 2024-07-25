const mypillController = require('../controllers/mypillController');
const express = require('express');
const router = express.Router();


router.post('/', mypillController.addMyPill);

router.put('/:mypillid', mypillController.updateMyPill);

router.get('/', mypillController.getMyPills);

router.delete('/:mypillid', mypillController.deleteMyPill);

export default router
