/**
File Name : Search
Description : 전체 검색화면
Author : 민선옥

History
Date        Author   Status    Description
2024.07.16  민선옥   Created
2024.07.19  민선옥   tsx로 변경 및 SearchResults 컴포넌트 이름 수정
*/

import React, { useState } from 'react';
import SearchBox from './SearchBox';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import Nav from '../Nav';
import styled from 'styled-components';

const BackgroundHeader = styled.div`
  position: relative;
  margin-bottom: 40px;
  width: 100vw;
  height: 55px;
  background-color: var(--main-color);
`;

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <>
      <BackgroundHeader>
        <SearchBox setSearchQuery={setSearchQuery} />
      </BackgroundHeader>
      {searchQuery ? <SearchResults /> : <SearchHistory />}
      <Nav />
    </>
  );
};

export default Search;
