const express = require('express');
const alarmController = require('../controllers/alarmController');

const router = express.Router();

router.post('/', alarmController.createAndScheduleAlarm);
router.get('/', alarmController.getUserAlarmsController);
router.put('/:id', alarmController.updateAlarmController);
router.delete('/:id', alarmController.deleteAlarmController);

module.exports = router;