/**
 * File Name : SearchResults
 * Description : 검색 후 화면, 약에 대한 설명
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.16  민선옥    Created
 * 2024.07.17  민선옥    PillMore추가
 * 2024.07.19  민선옥    tsx
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import PillExp from './PillExp';
import Review from './Review';

const SearchResultsContainer = styled.div``;

const PillHeader = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80vw;
  margin: auto;

  & section {
    margin-left: 30px;
  }
`;

const PillTitle = styled.div`
  & p {
    margin-top: 10px;
    font-size: 14px;
  }
  & span {
    color: #696969;
    font-size: 10px;
    font-style: italic;
  }
`;

const Chips = styled.div`
  display: flex;
  width: 100%;
  height: 30px;

  & p {
    width: 48px;
    height: 25px;
    margin-right: 10px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    line-height: 25px;
    border-radius: 5px;
    background-color: var(--main-color);
  }
`;

const Exp = styled.p`
  margin: 15px 20px;
  color: #696969;
  font-size: 14px;
  text-align: end;
`;

const PillMore = styled.div`
  margin-top: 30px;
`;

const Menu = styled.div`
  display: flex;
  border-bottom: 4px solid var(--main-color);

  & p {
    flex: 1;
    margin: 0;
    padding: 10px;
    text-align: center;
    cursor: pointer;
  }

  & p.active {
    border-radius: 10px 10px 0 0;
    background-color: var(--main-color);
  }
`;

const Contants = styled.div``;

const SearchResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <SearchResultsContainer>
      <PillHeader>
        <img src={`/img/pill.png`} alt='pill' />
        <section>
          <PillTitle>
            <h3>타이레놀정500밀리그람 (아세트아미노펜)</h3>
            <span>Tylenol Tablet 500mg</span>
            <p>한국존슨앤드존슨판매(유)</p>
            <span>Johnson & Johnson Consumer Health Korea</span>
          </PillTitle>
          <Chips>
            <p>두통</p>
            <p>신경통</p>
            <p>근육통</p>
          </Chips>
        </section>
      </PillHeader>
      <Exp>※ 태그들을 클릭해 관련 증상들을 모아보세요.</Exp>
      <PillMore>
        <Menu>
          <p
            className={activeTab === 0 ? 'active' : ''}
            onClick={() => setActiveTab(0)}
          >
            효능•용법
          </p>
          <p
            className={activeTab === 1 ? 'active' : ''}
            onClick={() => setActiveTab(1)}
          >
            리뷰
          </p>
        </Menu>
        <Contants>
          {activeTab === 0 && <PillExp />}
          {activeTab === 1 && <Review />}
        </Contants>
      </PillMore>
    </SearchResultsContainer>
  );
};

export default SearchResults;
