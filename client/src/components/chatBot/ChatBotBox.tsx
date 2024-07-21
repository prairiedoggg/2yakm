/**
File Name : ChatBotBox
Description : 챗봇 대화상자
Author : 임지영

History
Date        Author   Status    Description
2024.07.22  임지영   Created
*/

import styled from 'styled-components';

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
`;

const Chatting = styled.div``;

const ChatBotBox: React.FC = () => {
  return (
    <ChatBotBoxContainer>
      <Box>
        <Chatting />
      </Box>
    </ChatBotBoxContainer>
  );
};

export default ChatBotBox;
