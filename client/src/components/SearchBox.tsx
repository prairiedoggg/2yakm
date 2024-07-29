import { ChangeEvent, useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSearchStore } from '../store/search';
import { useSearchHistoryStore } from '../store/searchHistory';

const SearchBox = () => {
  const { setSearchQuery } = useSearchStore();
  const [query, setQuery] = useState<string>('');
  const addHistory = useSearchHistoryStore((state) => state.addHistory);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      addHistory(query);
    } else {
      setSearchQuery('');
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Link to='/search' onClick={handleSearch}>
        <SearchContainer>
          <SearchIcon
            src={`/img/search_icon.png`}
            alt='search'
            style={{ width: '20px' }}
          />

          <SearchInput
            placeholder='이미지 또는 이름으로 검색'
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon src={`/img/camera.png`} alt='camera' />
        </SearchContainer>
      </Link>
    </>
  );
};

export default SearchBox;

const SearchContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  width: 90vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: none;

  &::placeholder {
    color: #6c6b6b;
  }
`;

const SearchIcon = styled.img`
  width: 24px;
  cursor: pointer;
`;
