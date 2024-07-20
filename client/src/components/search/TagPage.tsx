/**
 * File Name : TagPage
 * Description : 증상과 연관된 약 나열
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.19  민선옥    Created
 */

import { useParams } from 'react-router-dom';
import styled from 'styled-components'; 
import Header from '../Header';
import Tag from '../Tag';
import Nav from '../Nav';

const TagTitle = styled.div`
  height: 50px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  background-color: var(--main-color);
`;

const ListContainer = styled.div`
  margin: auto;
  width: 85vw;
  > p {
    padding-top: 10px;
    color: #696969;
    font-size: 14px;
    font-style: italic;
  }
`;

const PillList = styled.ul``;

const PillItem = styled.li`
  display: flex;
  margin-top: 20px;
`;

const PillImg = styled.img.attrs({
  src: `/img/pill.png`,
  alt: 'user'
})`
  width: 120px;
`;

const PillText = styled.div`
  margin-left: 30px;
`;

const PillTitle = styled.div`
  display: flex;
  align-items: center;

  & h3 {
    font-size: 16px;
    font-weight: 400;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

const FavoritesCount = styled.div`
  display: flex;
  margin: 8px 0;
  & p {
    font-size: 14px;
    font-weight: 300;
    margin-right: 8px;
  }
`;

const TagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();

  return (
    <>
      <Header />
      <TagTitle>{tag}</TagTitle>
      <ListContainer>
        <p>즐겨찾기 개수로 정렬되었습니다.</p>
        <PillList>
          <PillItem>
            <PillImg></PillImg>
            <PillText>
              <PillTitle>
                <h3>타이레놀정500밀리그람 (아세트아미노펜)</h3>
                <img src='/img/arrow.svg' alt='더보기' />
              </PillTitle>
              <FavoritesCount>
                <p>즐겨찾기 1024</p>
                <p>리뷰 512</p>
              </FavoritesCount>
              <Tag>
                <p>두통</p>
                <p>신경통</p>
                <p>근육통</p>
              </Tag>
            </PillText>
          </PillItem>
        </PillList>
      </ListContainer>
      <Nav />
    </>
  );
};

export default TagPage;
