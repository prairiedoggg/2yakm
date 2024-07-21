/**
File Name : ChatBot
Description : 챗봇
Author : 임지영

History
Date        Author   Status    Description
2024.07.22  임지영   Created
*/

import styled from 'styled-components';
import Header from '../Header';
import ChatBotBox from './ChatBotBox';
import Nav from '../Nav';

const ChatBotContainer = styled.div`
  width: 100vw;
`;

const ChatBot: React.FC = () => {
  return (
    <ChatBotContainer>
      <Header />
      <ChatBotBox />
      <Nav />
    </ChatBotContainer>
  );
};

export default ChatBot;
