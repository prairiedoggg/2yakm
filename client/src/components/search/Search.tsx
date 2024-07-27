import styled from 'styled-components';
import SearchBox from '../SearchBox';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import Nav from '../Nav';
import { useSearchStore } from '../../store/search'


const Search = () => {
  const { searchQuery } = useSearchStore();

  return (
    <>
      <BackgroundHeader>
        <SearchBox />
      </BackgroundHeader>
      {searchQuery ? (
        <SearchResults/>
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
