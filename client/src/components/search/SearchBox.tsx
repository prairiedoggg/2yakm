import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
  useCallback
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchAutocompleteSuggestions,
  fetchPillDataByImage
} from '../../api/searchApi';
import { PillData, usePillStore } from '../../store/pill.ts';
import { useSearchStore } from '../../store/search';
import { useSearchHistoryStore } from '../../store/searchHistory';
import BottomPictureSheet from '../myPage/BottomPictureSheet';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages.tsx';
import { debounce } from 'lodash-es';

interface SearchBoxProps {
  setImageResults?: Dispatch<SetStateAction<PillData[]>>;
}

const SearchBox = ({ setImageResults }: SearchBoxProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const {
    setImageQuery,
    searchType,
    setSuggestions,
    setIsImageSearch,
    isImageSearch
  } = useSearchStore();
  const { setLoading } = usePillStore();
  const [bottomSheet, setBottomSheet] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  const addHistory = useSearchHistoryStore((state) => state.addHistory);

  useEffect(() => {
    if (query && searchType !== 'efficacy') {
      fetchSuggestions(query);
    }
  }, [query, searchType]);

  const fetchSuggestions = async (newQuery: string) => {
    if (newQuery === '') return;

    try {
      const results = await fetchAutocompleteSuggestions(newQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('자동완성 데이터 가져오기 실패:', error);
    }
  };

  const handleChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      if (isImageSearch) {
        setIsImageSearch(false);
      }
      const newQuery = e.target.value.trim();

      if (newQuery === '') {
        setSearchParams({ q: '' });
        return;
      }

      setSearchParams({ q: newQuery });

      if (searchType !== 'efficacy') {
        fetchSuggestions(newQuery);
      }
    }, 300),
    [searchType, isImageSearch]
  );


  const handleSearch = () => {
    if (query.trim()) {
      addHistory(query);
      navigate(`/search/${searchType}?q=${query}`);
    } else {
      setSearchParams({ q: '' });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCameraClick = () => {
    setBottomSheet(true);
    setPopupVisible(true);
    setPopupType(PopupType.ImageSearchInfo);
  };

  const handleImageUpload = async (image: File | null) => {
    if (image) {
      setImageQuery(image);
      setLoading(true);
      try {
        const results = await fetchPillDataByImage(image, 10, 0);
        setImageResults?.(results);
      } catch (error) {
        console.error('이미지 검색 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    setIsImageSearch(true);
    setBottomSheet(false);
    setPopupVisible(false);
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
      />
      {popupVisible && (
        <Popup onClose={() => setPopupVisible(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </>
  );
};

export default SearchBox;

const SearchContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
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
