import styled from 'styled-components';
import Layout from '../Layout';
import ChatBotBox from './ChatBotBox';

const ChatBot: React.FC = () => {
  return (
    <ChatBotContainer>
      <Layout />
      <ChatBotBox />
    </ChatBotContainer>
  );
};

export default ChatBot;

const ChatBotContainer = styled.div`
  width: 100vw;
`;
