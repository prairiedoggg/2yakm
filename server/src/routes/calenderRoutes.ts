const { Router } = require("express");
const calendarController = require('../controllers/calenderController');
const router = Router();
const authByToken = require('../middlewares/authByToken');


router.use(authByToken);
router.get('/:userId', calendarController.getAllCalendars);
router.get('/:userId/:id', calendarController.getCalendarById); // 일정 ID로 조회
router.post('/', calendarController.createCalendar);
router.put('/:id', calendarController.updateCalendar); // 일정 ID로 업데이트
router.delete('/:id', calendarController.deleteCalendar); // 일정 ID로 삭제

module.exports = router;