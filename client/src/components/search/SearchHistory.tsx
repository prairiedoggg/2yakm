import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSearchHistoryStore } from '../../store/searchHistory';

const SearchHistory = () => {
  const { history, clearHistory } = useSearchHistoryStore();

  return (
    <HistoryInner>
      <HistoryTitle>
        <span>최근 검색어</span>
        <span onClick={clearHistory}>전체삭제</span>
      </HistoryTitle>
      <HistoryList>
        {history
          .slice()
          .reverse()
          .map((item, index) => (
            <HistoryItem to={`/search/name?q=${item}`} key={index}>
              {item}
            </HistoryItem>
          ))}
      </HistoryList>
    </HistoryInner>
  );
};

export default SearchHistory;

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

const HistoryItem = styled(Link)`
  display: block;
  padding: 5px 0;
  color: #333;
`;
