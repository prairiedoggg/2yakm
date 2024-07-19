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
import Nav from '../Nav';

const TagTitle = styled.div`
  height: 50px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  background-color: var(--main-color);
`;

const ListContainer = styled.div``;

const PillList = styled.ul``;

const PillItem = styled.li``;

const PillImg = styled.img``;

const PillText = styled.div``;

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
              <h3>타이레놀</h3>
              
            </PillText>
          </PillItem>
        </PillList>
      </ListContainer>
      <Nav />
    </>
  );
};

export default TagPage;
