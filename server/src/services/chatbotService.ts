import { webSearch } from '../utils/webSearch';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { createError } from '../utils/error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
interface CustomRecordMetadata {
  name?: string;
  efficacy?: string;
  howtouse?: string;
  caution?: string;
}

//파인콘 연결
const pineconeApiKey = process.env.PINECONE_API_KEY;
if (!pineconeApiKey) {
  throw createError(
    'PINECONE_API_KEY 올바르지 않음',
    'PINECONE 연결 실패',
    500
  );
}

const pinecone = new Pinecone({
  apiKey: pineconeApiKey
});
const index = pinecone.Index('eyakmoyak');

// 대화 기록을 저장할 객체
const conversations = new Map();

export const processQuery = async (userId: string, message: string) => {
  try {
    // 사용자의 대화 기록 가져오기 또는 새로 생성
    if (!conversations.has(userId)) {
      conversations.set(userId, [
        {
          role: 'system',
          content:
            `당신은 고객에게 효능과 성분, 병용하면 안되는 약 등의 약 정보에 기반하여 적절한 약을 추천하는 약사입니다. 
            고객이 직접 작성한 증상 혹은 상담 내용에 따라 적절한 약을 상품명, 성분과 주의사항을 포함해서, 
            환자의 증상과의 연관성을 위주로 가장 권장할만한 것을 판단해서 추천해줘야 합니다. 
            예를 들어 고객이 머리가 아파요. 라고 했다면 머리가 아프시군요, 두통에 좋은 약을 추천해드리겠습니다. 
            ~후 효능에 해당 통증을 다루는 효능이 있는 약을 선정해, 설명 하는 방식으로 추천해야 합니다. 
            친근감 있는 대화 방식으로 추천해야 합니다.`
        }
      ]);
    }
    const conversation = conversations.get(userId);

    // 사용자 질문에 대한 임베딩 생성
    const queryEmbedding = await getEmbedding(message);
    // Pinecone에서 관련 약물 정보 검색
    const startTime = Date.now();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 30,
      includeMetadata: true
    });
    const endTime = Date.now();
    // 가중치를 고려하여 결과 재정렬
    const weightedResults = queryResponse.matches
      .map((match: any) => ({
        ...match,
        weightedScore: match.score * (match.metadata.weight ?? 1)
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 5);

    const relevantDrugs = weightedResults.map(
      (match: any) => (match.metadata as CustomRecordMetadata) ?? {}
    );

    // 사용자 메시지 추가
    const prompt = `사용자 질문: ${message}\n\n관련 약물 정보: ${JSON.stringify(relevantDrugs)}`;
    conversation.push({ role: 'user', content: prompt });

    // 대화 기록의 길이를 제한 (예: 최근 10개의 메시지만 유지)
    const recentConversation = conversation.slice(-10);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: recentConversation,
      max_tokens: 1300
    });

    const assistantResponse =
      response.choices[0]?.message?.content?.trim() ?? '';

    // 어시스턴트 응답 추가
    conversation.push({ role: 'assistant', content: assistantResponse });
    // 대화 기록 업데이트
    conversations.set(userId, conversation);
    return assistantResponse;
  } catch (error: any) {
    console.error('GPT API 오류:', error);
    if (error.code === 'insufficient_quota') {
      return '죄송합니다. 현재 서비스 사용량이 많아 일시적으로 응답할 수 없습니다. 나중에 다시 시도해 주세요.';
    }
    return '죄송합니다. 서비스에 문제가 발생했습니다. 나중에 다시 시도해 주세요.';
  }
};

// 대화 종료 함수 추가
export const endConversation = (userId: string) => {
  conversations.delete(userId);
  return '대화가 종료되었습니다. 새로운 대화를 시작할 수 있습니다.';
};

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  if (!response.data ?? response.data.length === 0) {
    throw new Error('임베딩 데이터를 가져오지 못했습니다.');
  }
  return response.data[0].embedding;
}
