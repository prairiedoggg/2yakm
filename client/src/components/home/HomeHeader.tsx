/**
File Name : HomeHeader
Description : 메인페이지 상단 컴포넌트
Author : 임지영

History
Date        Author   Status    Description
2024.07.16  임지영   Created
2024.07.16  임지영   Modified    색상 #ffeb41
2024.07.18  임지영   Modified    tsx
*/

import { useState } from 'react';
import styled from 'styled-components';
import SearchBox from '../SearchBox';

const MainHeaderContainer = styled.div`
  width: 100vw;
  height: 25vh;
  background-color: #ffeb41;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img.attrs({
  src: `/img/logo.svg`,
  alt: 'Logo'
})`
  width: 300px;
  height: auto;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 20vh;
`;

const MainHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<String>('');

  return (
    <MainHeaderContainer>
      <Logo />
      <SearchContainer>
        <SearchBox setSearchQuery={setSearchQuery} />
      </SearchContainer>
    </MainHeaderContainer>
  );
};

export default MainHeader;
