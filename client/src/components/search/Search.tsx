import { ChangeEvent } from 'react';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import TagPage from './TagPage'
import Nav from '../Nav';
import { useSearchStore } from '../../store/search'


const Search = () => {
  const { searchQuery, searchType, setSearchType } = useSearchStore();

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };

  return (
    <>
      <BackgroundHeader>
        <SearchTypeSelect onChange={handleTypeChange}>
          <option value='name'>이름</option>
          <option value='efficacy'>효능</option>
        </SearchTypeSelect>
        <SearchBox />
      </BackgroundHeader>
      {searchQuery ? (
        searchType === 'name' ? (
          <SearchResults />
        ) : (
          <TagPage />
        )
      ) : (
        <SearchHistory />
      )}
      <Nav />
    </>
  );
};

export default Search;

const BackgroundHeader = styled.div`
  position: relative;
  margin-bottom: 40px;
  width: 100vw;
  height: 55px;
  background-color: var(--main-color);
`;

const SearchTypeSelect = styled.select`
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  width: 90vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 0 15px;
  box-sizing: border-box;
  outline: none;
  border: none;
  font-size: 16px;
`;