import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import styled from 'styled-components';

interface InfoText {
  text: string;
}

const Info = ({ text }: InfoText) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <InfoContainer>
      <Icon icon='gg:info' width='17px' onClick={() => setShow(!show)} />
      {show ?? <Text>{text}</Text>}
    </InfoContainer>
  );
};

export default Info;

const InfoContainer = styled.div`
  margin-top: 2px;
  margin-left: 5px;
  display: flex;
`;

const Text = styled.div`
  padding: 5px;
  color: #777777;
  font-size: 10pt;
`;
