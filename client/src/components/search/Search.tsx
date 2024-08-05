import { useState } from 'react';
import { PillData } from '../../store/pill.ts';
import { useSearchStore } from '../../store/search.ts';
import SearchHeader from './SearchHeader.tsx';
import Nav from '../Nav';
import AutoComplete from './AutoComplete.tsx';
import ImageSearchList from './ImageSearchList.tsx';
import SearchHistory from './SearchHistory.tsx';

const Search = () => {
  const [imageResults, setImageResults] = useState<PillData[]>([]);
  const {
    searchQuery,
    searchType,
    setSearchType,
    setSearchQuery,
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

    if (searchQuery && searchType !== 'efficacy') return <AutoComplete />;

    return <SearchHistory />;
  };

  return (
    <>
      <SearchHeader
        activeType={activeType}
        handleTypeClick={handleTypeClick}
        setImageResults={setImageResults}
      />
      {renderer()}
      <Nav />
    </>
  );
};

export default Search;
