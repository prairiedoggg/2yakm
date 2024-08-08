import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { PillData } from '../../store/pill.ts';
import SearchBox from './SearchBox';

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

interface SearchHeaderProps {
  activeType?: string;
  handleTypeClick: (type: string) => void;
  setImageResults?: Dispatch<SetStateAction<PillData[]>>;
}

const SearchHeader = ({
  activeType,
  handleTypeClick,
  setImageResults
}: SearchHeaderProps) => {
  return (
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
  );
};

export default SearchHeader;

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
