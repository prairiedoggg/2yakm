/**
 * File Name : SearchHistory
 * Description : 검색히스토리 시각화
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.16  민선옥    Created
 * 2024.07.19  민선옥    tsx
 */

import React from 'react';
import styled from 'styled-components';

const HistoryContainer = styled.div``;

const HistoryInner = styled.div`
  width: 85vw;
  margin: auto;
`;

const HistoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  color: #686868;
  font-size: 15px;
  font-weight: 500;
`;

const SearchHistory: React.FC = () => {
  return (
    <HistoryContainer>
      <HistoryInner>
        <HistoryTitle>
          <span>최근 검색어</span>
          <span>전체삭제</span>
        </HistoryTitle>
      </HistoryInner>
    </HistoryContainer>
  );
};

export default SearchHistory;
