const express = require('express');
const router = express.Router();
const gptController = require('../controllers/chatbotController');

router.post('/chat', gptController.chat);

module.exports = router;