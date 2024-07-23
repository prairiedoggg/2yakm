import { useState } from 'react';
import SearchBox from '../SearchBox';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import Nav from '../Nav';
import styled from 'styled-components';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  console.log(searchQuery)

  return (
    <>
      <BackgroundHeader>
        <SearchBox setSearchQuery={setSearchQuery} />
      </BackgroundHeader>
      {searchQuery ? (
        <SearchResults searchQuery={searchQuery} />
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
