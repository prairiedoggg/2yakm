const chatbotService = require('../services/chatbotService');

export const chat = async(req: any, res: any) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const reply = await chatbotService.processQuery(userId, message);
    res.json({ reply });
  } catch (error) {
    console.error('GPT API 오류:', error);
    res.status(500).json({ error: 'GPT API 요청 중 오류가 발생했습니다.' });
  }
}

export const endChat = async(req: any, res: any) => {
  try {
    const userId = req.user.id;
    const message = chatbotService.endConversation(userId);
    res.json({ message });
  } catch (error) {
    console.error('대화 종료 오류:', error);
    res.status(500).json({ error: '대화 종료 중 오류가 발생했습니다.' });
  }
}