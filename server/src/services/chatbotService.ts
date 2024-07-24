const OpenAI = require("openai");
const webSearch = require('../utils/webSearch');
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
interface CustomRecordMetadata {
  name?: string;
  efficacy?: string;
  howtouse?: string;
  caution?: string;
}

//파인콘 연결
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

const index = pinecone.Index("eyakmoyak");

// 대화 기록을 저장할 객체
const conversations = new Map();

export const processQuery = async(userId: string, message: string) => {
  try {
    // 사용자의 대화 기록 가져오기 또는 새로 생성
    if (!conversations.has(userId)) {
      conversations.set(userId, [
        { role: "system", content: "당신은 고객에게 효능과 성분에 기반하여 적절한 약을 추천하는 약사입니다. 고객의 증상 혹은 상담 내용에 따라 적절한 약을 상품명, 성분과 주의사항을 포함해서, 환자의 증상과의 연관성을 위주로 가장 권장할만한 것을 판단해서 추천해줘야 합니다. 예를 들어 고객이 머리가 아파요. 라고 했다면 머리가 아프시군요, 두통에 좋은 약을 추천해드리겠습니다. ~후 설명 하는 방식으로 추천해야 합니다. 친근감 있는 대화 방식으로 추천해야 합니다." }
      ]);
    }
    const conversation = conversations.get(userId);

        // 사용자 질문에 대한 임베딩 생성
        const queryEmbedding = await getEmbedding(message);

        // Pinecone에서 관련 약물 정보 검색
        const queryResponse = await index.query({
          vector: queryEmbedding,
          topK: 3,
          includeMetadata: true
        });
    const searchResults = await webSearch(message);
    const relevantDrugs = queryResponse.matches.map((match: any) => 
      (match.metadata as CustomRecordMetadata) || {}
    );
    // 사용자 메시지 추가
    const prompt = `웹 검색 결과: ${JSON.stringify(searchResults)}\n\n사용자 질문: ${message}\n\n관련 약물 정보: ${JSON.stringify(relevantDrugs)}`;
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

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}