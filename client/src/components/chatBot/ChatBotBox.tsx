import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import styled from 'styled-components';

const ChatBotBox: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [chatBotSpeaking, setChatBotSpeaking] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // const handleChatting = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const res = await chatBot(text);
  //     console.log('챗봇 대답', res);
  //     setChatBotSpeaking(res.reply);
  //     setText('');
  //   } catch (err) {
  //     console.log('챗봇 대화 실패', err);
  //   }
  // };

  const firstChat = () => {
    return (
      <div>
        증상에 맞는 약을 찾고 계신가요? <br />
        <br />
        저에게 구체적으로 증상을 말씀해주시면 더 정확히 답변 드릴 수 있어요 😃{' '}
      </div>
    );
  };

  return (
    <ChatBotBoxContainer>
      <Box>
        <ChattingContainer>
          <BotChattingContainer>
            <Icon
              icon='fxemoji:frontfacingchick'
              style={{
                backgroundColor: 'white',
                height: '30px',
                borderRadius: '20px',
                marginRight: '5px',
                marginTop: '5px'
              }}
              width='30px'
            />
            <BotChatting>
              {firstChat()}
              {chatBotSpeaking}
            </BotChatting>
          </BotChattingContainer>
        </ChattingContainer>
        {/* onSubmit={handleChatting} */}
        <ChattingInputContainer>
          <Chatting
            placeholder='증상에 맞는 약을 머약이에게 질문해보세요!'
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
`;
const Box = styled.div`
  margin: 10px 5%;
  position: relative;
  border-radius: 50px;
  background-color: #ffe612;
  width: 90%;
  height: 78vh;
  overflow-y: auto;
  padding: 20px;
  font-size: 10.5pt;
`;

const ChattingContainer = styled.div`
  margin-top: 10px;
`;

const BotChattingContainer = styled.div`
  display: flex;
`;

const BotChatting = styled.div`
  background-color: white;
  width: 85%;
  border-radius: 20px;
  padding: 15px 15px;
  line-height: 18px;
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
