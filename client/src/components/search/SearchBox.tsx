import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useState
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchAutocompleteSuggestions,
  fetchPillDataByImage
} from '../../api/searchApi';
import { PillData } from '../../store/pill.ts';
import { useSearchStore } from '../../store/search';
import { useSearchHistoryStore } from '../../store/searchHistory';
import BottomPictureSheet from '../myPage/BottomPictureSheet';

interface SearchBoxProps {
  setImageResults?: Dispatch<SetStateAction<PillData[]>>;
}

const SearchBox = ({ setImageResults }: SearchBoxProps) => {
  const navigate = useNavigate();
  const {
    setSearchQuery,
    setImageQuery,
    searchType,
    setSuggestions,
    setIsImageSearch,
    isImageSearch,
  } = useSearchStore();
  const [query, setQuery] = useState<string>('');
  const [bottomSheet, setBottomSheet] = useState(false);
  const addHistory = useSearchHistoryStore((state) => state.addHistory);

  const fetchSuggestions = async (newQuery: string) => {
    if (newQuery === '') return;

    try {
      const results = await fetchAutocompleteSuggestions(newQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('자동완성 데이터 가져오기 실패:', error);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchQuery(newQuery);

    if (searchType !== 'efficacy') {
      await fetchSuggestions(newQuery);
    }

    if (isImageSearch) {
      setIsImageSearch(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      addHistory(query);

      navigate(`/search/${searchType}?q=${query}`);
    } else {
      setSearchQuery('');
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCameraClick = () => {
    setBottomSheet(true);
  };

  const handleImageUpload = async (image: File | null) => {
    if (image) {
      setImageQuery(image);
      try {
        const results = await fetchPillDataByImage(image, 10, 0);
        setImageResults?.(results);
      } catch (error) {
        console.error('이미지 검색 실패:', error);
      }
    }
    setIsImageSearch(true);
    setBottomSheet(false);
  };

  return (
    <>
      <Link to='/search' onClick={handleSearch}>
        <SearchContainer>
          <SearchIcon
            src={`/img/search_icon.png`}
            alt='search'
            style={{ width: '20px' }}
          />

          <SearchInput
            placeholder='이미지 또는 이름으로 검색'
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon
            src={`/img/camera.png`}
            alt='camera'
            onClick={handleCameraClick}
          />
        </SearchContainer>
      </Link>
      <BottomPictureSheet
        title={'사진 등록'}
        isVisible={bottomSheet}
        onClose={handleImageUpload}
      ></BottomPictureSheet>
    </>
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
  cursor: pointer;
`;
