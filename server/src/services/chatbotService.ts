const OpenAI = require("openai");
const webSearch = require('../utils/webSearch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 대화 기록을 저장할 객체
const conversations = new Map();

export const processQuery = async(userId: string, message: string) => {
  try {
    // 사용자의 대화 기록 가져오기 또는 새로 생성
    if (!conversations.has(userId)) {
      conversations.set(userId, [
        { role: "system", content: "당신은 고객에게 효능과 성분에 기반하여 적절한 약을 추천하는 약사입니다. 또한 DB를 참조하여 추천해야 합니다." }
      ]);
    }
    const conversation = conversations.get(userId);

    const prompt = `\n\n사용자 질문: ${message}`;
    
    // const searchResults = await webSearch(message);
    // const prompt = `웹 검색 결과: ${JSON.stringify(searchResults)}\n\n사용자 질문: ${message}`;
    
    // 사용자 메시지 추가
    conversation.push({ role: "user", content: prompt });

    // 대화 기록의 길이를 제한 (예: 최근 10개의 메시지만 유지)
    const recentConversation = conversation.slice(-10);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: recentConversation,
      max_tokens: 1300
    });

    const assistantResponse = response.choices[0].message.content.trim();
    
    // 어시스턴트 응답 추가
    conversation.push({ role: "assistant", content: assistantResponse });

    // 대화 기록 업데이트
    conversations.set(userId, conversation);
    console.log('현재 대화 기록:', conversation);
    return assistantResponse;
  } catch (error: any) {
    console.error('GPT API 오류:', error);
    if (error.code === 'insufficient_quota') {
      return '죄송합니다. 현재 서비스 사용량이 많아 일시적으로 응답할 수 없습니다. 나중에 다시 시도해 주세요.';
    }
    return '죄송합니다. 서비스에 문제가 발생했습니다. 나중에 다시 시도해 주세요.';
  }
}

// 대화 종료 함수 추가
export const endConversation = (userId: string) => {
  conversations.delete(userId);
  return "대화가 종료되었습니다. 새로운 대화를 시작할 수 있습니다.";
}