import { Icon } from '@iconify-icon/react';
import styled from 'styled-components';

interface BotChatting {
  text: string;
  loading: boolean;
}

const BotChat = ({ text, loading }: BotChatting) => {
  return (
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
      <Bot>
        <BotName>머약</BotName>
        <BotChatting>
          {/* {loading ? (
            <Icon
              icon='eos-icons:three-dots-loading'
              width='30'
              style={{ textAlign: 'center' }}
            />
          ) : (
            text
          )} */}
          {text}
        </BotChatting>
      </Bot>
    </BotChattingContainer>
  );
};

export default BotChat;

const BotChattingContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const BotChatting = styled.div`
  background-color: white;
  width: 250px;
  border-radius: 20px;
  padding: 15px 15px;
  line-height: 18px;
  margin-left: 5px;
  position: relative;
  z-index: 80;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: -4%;
    border-width: 15px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const Bot = styled.div`
  display: flex;
  flex-direction: column;
`;

const BotName = styled.div`
  font-weight: 500;
  padding: 5px 5px;
`;
