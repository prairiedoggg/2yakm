import styled from 'styled-components';
import { useSearchStore } from '../../store/search';
import { useSearchHistoryStore } from '../../store/searchHistory';

const SearchHistory = () => {
  const { searchQuery } = useSearchStore();
  const { history, clearHistory } = useSearchHistoryStore();

  return (
    <>
      <HistoryContainer>
        <div>{searchQuery}</div>
        <HistoryInner>
          <HistoryTitle>
            <span>최근 검색어</span>
            <span onClick={clearHistory}>전체삭제</span>
          </HistoryTitle>
          <HistoryList>
            {history.map((item, index) => (
              <HistoryItem key={index}>{item}</HistoryItem>
            ))}
          </HistoryList>
        </HistoryInner>
      </HistoryContainer>
    </>
  );
};

export default SearchHistory;

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

const HistoryList = styled.div`
  margin-top: 10px;
`;

const HistoryItem = styled.div`
  padding: 5px 0;
  color: #333;
`;
