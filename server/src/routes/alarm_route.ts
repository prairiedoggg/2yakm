const express = require('express');
const { createAndScheduleAlarm, getUserAlarmsController, updateAlarmController, deleteAlarmController } = require('../controllers/alarmController');

const router = express.Router();

router.post('/', createAndScheduleAlarm);
router.get('/user/:userId', getUserAlarmsController);
router.put('/update/:id', updateAlarmController);
router.delete('/delete/:id', deleteAlarmController);

module.exports = router;