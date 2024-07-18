/**
File Name : News
Description : 카드뉴스 
Author : 임지영

History
Date        Author   Status    Description
2024.07.16  임지영   Created
2024.07.17  임지영   Modified    Nav 추가
*/

import styled from 'styled-components';
import Header from '../Header';
import NewsTitle from './NewsTitle';
import NewsSlide from './NewsSlide';
import NewsDescription from './NewsDescription';
import Nav from '../Nav';

const NewsContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

interface NewsNumber {
  num: number;
}

const News: React.FC<NewsNumber> = ({ num }) => {
  return (
    <NewsContainer>
      <Header />
      <NewsTitle num={num} />
      <NewsSlide num={num} />
      <NewsDescription num={num} />
      <Nav />
    </NewsContainer>
  );
};

export default News;
