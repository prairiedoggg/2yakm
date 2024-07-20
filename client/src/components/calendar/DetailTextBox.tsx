/**
File Name : DetailTextBox
Description : 캘린더 하단 세부 내용 텍스트 박스
Author : 임지영

History
Date        Author   Status    Description
2024.07.19  임지영   Created
*/

import styled from 'styled-components';

const Container = styled.div`
  border: 0.5px #d9d9d9 solid;
  border-radius: 5px;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
`;
const ContentTitle = styled.div`
  font-size: 14pt;
`;
const UnitContainer = styled.div`
  display: flex;
`;
interface Title {
  title: string;
}

const DetailTextBox: React.FC<Title> = ({ title }) => {
  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return (
          <>
            <p>11시</p>
          </>
        );
      case '체온':
        return (
          <UnitContainer>
            <p>37</p>
            <p>°C</p>
          </UnitContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <ContentTitle>{title}</ContentTitle>
      {handleContent()}
    </Container>
  );
};

export default DetailTextBox;
