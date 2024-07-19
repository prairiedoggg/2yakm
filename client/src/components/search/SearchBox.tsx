/**
 * File Name : SearchBox
 * Description : 검색 Input 창
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.16  민선옥    Created
 * 2024.07.16  임지영    Modified    placeholder 추가
 * 2024.07.19  민선옥    tsx
 */

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

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
`;

interface SearchBoxProps {
  setSearchQuery: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ setSearchQuery }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchIcon
        src={`/img/search_icon.png`}
        alt='search'
        style={{ width: '20px' }}
      />
      <SearchInput
        placeholder='이미지 또는 이름으로 검색'
        onChange={handleChange}
      />
      <SearchIcon
        src={`/img/camera.png`}
        alt='camera'
      />
    </SearchContainer>
  );
};

export default SearchBox;
