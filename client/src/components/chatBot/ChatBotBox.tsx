import { Icon } from '@iconify-icon/react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { chatBot } from '../../api/chatbot';
import { useChatBot } from '../../store/chatbot';
import BotChat from './BotChat';
import UserChat from './UserChat';

const ChatBotBox: React.FC = () => {
  const { chatList, addBotChat, addUserChat } = useChatBot();
  const [text, setText] = useState<string>('');
  const chattingContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 스크롤 항상 허용
  useEffect(() => {
    if (chattingContainerRef.current) {
      chattingContainerRef.current.scrollTop =
        chattingContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  const handleChatting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === '') return;

    addUserChat(text);
    setLoading(true);

    try {
      const res = await chatBot(text);
      console.log('챗봇 대답', res);
      addBotChat(res.reply);
    } catch (err) {
      console.log('챗봇 대화 실패', err);
    } finally {
      setLoading(false);
    }
    setText('');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <ChatBotBoxContainer>
      <Box>
        <ChattingContainer ref={chattingContainerRef}>
          {chatList.map((chat, index) =>
            chat.sender === 'user' ? (
              <UserChat key={index} text={chat.text} />
            ) : (
              <BotChat key={index} text={chat.text} loading={loading} />
            )
          )}
        </ChattingContainer>
        <ChattingInputContainer onSubmit={handleChatting}>
          <Chatting
            placeholder='증상에 맞는 약을 질문해보세요!'
            onChange={onChange}
            value={text}
          />
          <SubmitButton type='submit'>
            <Icon
              icon='clarity:circle-arrow-solid'
              style={{ color: ' #FFBB25' }}
              width='30px'
            />
          </SubmitButton>
        </ChattingInputContainer>
      </Box>
    </ChatBotBoxContainer>
  );
};

export default ChatBotBox;

const ChatBotBoxContainer = styled.div`
  width: 100%;
  height: 87vh;
`;

const Box = styled.div`
  margin: 10px 5%;
  position: relative;
  border-radius: 40px;
  background-color: #ffe612;
  width: 90%;
  height: 90%;
  padding: 10px;
  font-size: 10.5pt;
`;

const ChattingContainer = styled.div`
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 90%;
`;

const ChattingInputContainer = styled.form`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 5px;
  box-sizing: border-box;
  width: 80vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Chatting = styled.input`
  flex: 1;
  border-width: 0;

  &::placeholder {
    color: #6c6b6b;
  }

  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  border: none;
  background: none;
`;
