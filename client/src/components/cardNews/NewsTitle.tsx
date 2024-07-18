/**
File Name : NewsTitle
Description : 뉴스 상단 타이틀
Author : 임지영

History
Date        Author   Status    Description
2024.07.16  임지영   Created
*/

import styled from 'styled-components';
import '../../assets/font/font.css';

const NewsTitleContainer = styled.div`
  width: 100vw;
  height: 11vh;
  background-color: #ffeb41;
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  padding-top: 2.5vh;
`;

const BigTitle = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
`;

const SmallTitle = styled.div`
  font-weight: 500;
`;

const PillIcon = styled.img.attrs({
  src: `/img/pillIcon.png`,
  alt: 'pill img'
})`
  width: 55px;
  height: 55px;
`;

const QnA = styled.img.attrs({
  src: `/img/QnA.png`,
  alt: 'qna img'
})`
  width: 75px;
  height: 50px;
`;

const StopImg = styled.img.attrs({
  src: `/img/stop.png`,
  alt: 'stop img'
})`
  width: 55px;
  height: 55px;
`;

interface NewsNumber {
  num: number;
}

const NewsTitle: React.FC<NewsNumber> = ({ num }) => {
  const bigTitle: string =
    num === 1
      ? '음주 후 복용 멈춰!'
      : num === 2
      ? '올바른 약 복용법'
      : '해열제 성분 종류';

  const smallTitle: string =
    num === 1
      ? '해열제 종류 성분에 대해서 알아봐요'
      : num === 2
      ? '약 복용법에 대해 QnA로 알아봅시다'
      : '술 마시고 먹으면 절대 안 되는 약 7가지';

  const handleImage = () => {
    switch (num) {
      case 1:
        return <StopImg />;
      case 2:
        return <QnA />;
      case 3:
        return <PillIcon />;
    }
  };

  return (
    <NewsTitleContainer>
      <Title>
        <BigTitle>{bigTitle}</BigTitle>
        <SmallTitle>{smallTitle}</SmallTitle>
      </Title>
      <Title>{handleImage()}</Title>
    </NewsTitleContainer>
  );
};

export default NewsTitle;
