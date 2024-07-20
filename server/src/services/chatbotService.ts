const OpenAI = require("openai");
const webSearch = require('../utils/webSearch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processQuery(message: string) {
    try {
      const searchResults = await webSearch(message);
      const prompt = `웹 검색 결과: ${JSON.stringify(searchResults)}\n\n사용자 질문: ${message}`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150
      });
  
      return response.choices[0].message.content.trim();
    } catch (error: any) {
      console.error('GPT API 오류:', error);
      if (error.code === 'insufficient_quota') {
        return '죄송합니다. 현재 서비스 사용량이 많아 일시적으로 응답할 수 없습니다. 나중에 다시 시도해 주세요.';
      }
      return '죄송합니다. 서비스에 문제가 발생했습니다. 나중에 다시 시도해 주세요.';
    }
  }

module.exports = {
  processQuery
};