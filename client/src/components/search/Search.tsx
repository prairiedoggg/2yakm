import { useState } from 'react';
import styled from 'styled-components';
import { PillData } from '../../store/pill.ts';
import { useSearchStore } from '../../store/search.ts';
import Nav from '../Nav';
import AutoComplete from './AutoComplete.tsx';
import ImageSearchList from './ImageSearchList.tsx';
import SearchBox from './SearchBox';
import SearchHistory from './SearchHistory.tsx';
import SearchResults from './SearchResults.tsx';

const SEARCH_TYPES = [
  {
    key: 'name',
    label: '이름으로 검색'
  },
  {
    key: 'efficacy',
    label: '효능으로 검색'
  }
];

const Search = () => {
  const [imageResults, setImageResults] = useState<PillData[]>([]);
  const {
    searchQuery,
    searchType,
    setSearchType,
    setSearchQuery,
    isSearched,
    isImageSearch
  } = useSearchStore();
  const [activeType, setActiveType] = useState<string>(searchType);

  const handleTypeClick = (type: string) => {
    setSearchType(type);
    setSearchQuery('');
    setActiveType(type);
  };

  const renderer = () => {
    if (isImageSearch) return <ImageSearchList pills={imageResults} />;

    if (searchQuery) {
      if (isSearched) {
        return <SearchResults />;
      }

      if (searchType !== 'efficacy') {
        return <AutoComplete />;
      }
    }

    return <SearchHistory />;
  };
  return (
    <>
      <BackgroundHeader>
        <SearchTypeSelect>
          {SEARCH_TYPES.map((type) => {
            const { key, label } = type;
            const isActive = key === activeType;

            return (
              <SearchTypeButton
                key={key}
                onClick={() => handleTypeClick(key)}
                $isActive={isActive}
              >
                {label}
              </SearchTypeButton>
            );
          })}
        </SearchTypeSelect>
        <SearchBox setImageResults={setImageResults} />
      </BackgroundHeader>
      {renderer()}
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

const SearchTypeButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  color: ${({ $isActive }) => (!$isActive ? 'gray' : 'black')};
  border: none;
  background: none;

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
