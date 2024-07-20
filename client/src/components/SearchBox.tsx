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
 * 2024.07.20  민선옥    navigate추가
 */

import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface SearchBoxProps {
  setSearchQuery: (query: string) => void;
}

const SearchBox = ({ setSearchQuery }: SearchBoxProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(query);
    navigate('/search');
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
        onClick={handleSearch}
      />
      <SearchIcon src={`/img/camera.png`} alt='camera' />
    </SearchContainer>
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
`;