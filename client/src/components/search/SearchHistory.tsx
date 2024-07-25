import { useEffect } from 'react';
import styled from 'styled-components';
import { useSearchHistoryStore } from '../../store/searchHistory';

const SearchHistory = () => {
  const { history, clearHistory, setHistory } = useSearchHistoryStore(
    (state) => ({
      history: state.history,
      clearHistory: state.clearHistory,
      setHistory: state.setHistory
    })
  );

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      // 중복 방지를 위해 조건 추가
      if (history.length === 0) {
        setHistory(parsedHistory);
      }
    }
  }, [history, setHistory]);

  return (
    <HistoryContainer>
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
