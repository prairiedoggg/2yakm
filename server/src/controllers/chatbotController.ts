const chatbotService = require('../services/chatbotService');

async function chat(req: any, res: any) {
  try {
    const { message } = req.body;
    const reply = await chatbotService.processQuery(message);
    res.json({ reply });
  } catch (error) {
    console.error('GPT API 오류:', error);
    res.status(500).json({ error: 'GPT API 요청 중 오류가 발생했습니다.' });
  }
}

module.exports = {
  chat
};