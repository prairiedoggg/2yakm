import { post } from './api';

const url = import.meta.env.VITE_APP_SERVER_BASE_URL;

export const chatBot = async (question: string) => {
  try {
    const res = await post(
      `${url}api/chatbot/chat`,
      { message: question },
      {
        withCredentials: true
      }
    );
    return res.reply;
  } catch (err) {
    console.log('챗봇 대화 실패', err);
  }
};

export const endChatBot = async () => {
  try {
    const res = await post(
      `${url}api/chatbot/end`,
      {},
      {
        withCredentials: true
      }
    );
    return res.message;
  } catch (err) {
    console.log('챗봇 대화 종료 실패', err);
  }
};
