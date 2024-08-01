import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import TagPage from './TagPage';
import Nav from '../Nav';
import { useSearchStore } from '../../store/search';

const Search = () => {
  const { searchQuery, setSearchQuery, searchType, setSearchType } =
    useSearchStore();
  const [activeType, setActiveType] = useState<string>(searchType);

  const handleTypeClick = (type: string) => {
    setSearchType(type);
    setSearchQuery('');
    setActiveType(type);
  };

  return (
    <>
        <BackgroundHeader>
          <SearchTypeSelect>
            <SearchTypeButton
              onClick={() => handleTypeClick('name')}
              className={activeType === 'name' ? 'active' : ''}
            >
              이름으로 검색
            </SearchTypeButton>
            <SearchTypeButton
              onClick={() => handleTypeClick('efficacy')}
              className={activeType === 'efficacy' ? 'active' : ''}
            >
              효능으로 검색
            </SearchTypeButton>
          </SearchTypeSelect>
          <SearchBox />
        </BackgroundHeader>
      {searchQuery ? (
        searchType === 'name' ? (
          <SearchResults />
        ) : (
           <Link to={`/search/tag/${searchQuery}`}/>
        )
      ) : (
        <SearchHistory/>
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

const SearchTypeSelect = styled.div`
  padding: 10px 20px;
`;


const SearchTypeButton = styled.button`
  position: relative;
  color: gray;
  border: none;
  background: none;

  &.active {
    color: black;
  }

  &:first-child::after {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    content: '';
    display: block;
    width: 1px;
    height: 10px;
    background-color: gray;
  }
`;
