const { Router } = require("express");
const calendarController = require('../controllers/calendarController');
const router = Router();

router.get('/', calendarController.getAllCalendars); //사용자 일정 전체보기
router.get('/:id', calendarController.getCalendarById); // 일정 상세보기
router.post('/', calendarController.createCalendar); // 일정 작성
router.put('/:id', calendarController.updateCalendar); // 일정 ID로 업데이트
router.delete('/:id', calendarController.deleteCalendar); // 일정 ID로 삭제

module.exports = router;