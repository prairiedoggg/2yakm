import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatBot {
  chatList: Array<{ sender: string; text: string }>;
  addBotChat: (botChat: string) => void;
  addUserChat: (userChat: string) => void;
}

export const useChatBot = create(
  persist<ChatBot>(
    (set) => ({
      chatList: [
        {
          sender: 'bot',
          text: '증상에 맞는 약을 찾고 계신가요? 저에게 구체적으로 증상을 말씀해주시면 더 정확히 답변 드릴 수 있어요 😃'
        }
      ],
      addBotChat: (newBotChat) =>
        set((state) => ({
          chatList: [...state.chatList, { sender: 'bot', text: newBotChat }]
        })),
      addUserChat: (newUserChat) =>
        set((state) => ({
          chatList: [...state.chatList, { sender: 'user', text: newUserChat }]
        }))
    }),
    {
      name: 'chat-bot-storage'
    }
  )
);
