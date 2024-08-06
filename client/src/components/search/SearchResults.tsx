import { Icon } from '@iconify-icon/react';
import informationOutline from '@iconify/icons-mdi/information-outline';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchFavoriteCount,
  fetchFavoriteStatusApi,
  toggleFavoriteApi
} from '../../api/favoriteApi';
import { fetchPillDataByName } from '../../api/searchApi';
import { useFavoriteStore } from '../../store/favorite';
import { usePillStore } from '../../store/pill';
import Nav from '../Nav';
import PillExp from './PillExp';
import Review from './Review';
import SearchHeader from './SearchHeader';
import Loading from '../Loading'; 

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { pillData, setPillData, loading, setLoading } = usePillStore();
  const { isFavorite, setIsFavorite, favoriteCount, setFavoriteCount } =
    useFavoriteStore();
  const [activeTab, setActiveTab] = useState<string>('effectiveness');
  const [pillId, setPillId] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>('name');
  const [activeType, setActiveType] = useState<string>(searchType);


  const formatTextWithLineBreaks = (text: string) => {
    return text.split('(').map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && (
          <>
            <br />({}
          </>
        )}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPillDataByName(query, 1, 0);
        if (data) {
          setPillId(data.id);
          setPillData(data);
          console.log('약데이터', data);
          const count = await fetchFavoriteCount(data.id);
          console.log('좋아요 수', count);
          setFavoriteCount(count);
          const status = await fetchFavoriteStatusApi(data.id);
          setIsFavorite(status);
        } else {
          setPillData(null);
          setPillId(null);
        }
      } catch (error) {
        console.error('검색결과페이지 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, setIsFavorite, setPillData]);

  const handleToggleFavorite = async () => {
    if (!pillId) return;
    try {
      await toggleFavoriteApi(
        { id: pillId },
        (response) => {
          setIsFavorite(!isFavorite);
          console.log(response.message);
        },
        (error) => {
          console.error('좋아요 상태 업데이트 에러:', error);
        }
      );
      const count = await fetchFavoriteCount(pillId);
      setFavoriteCount(count);
    } catch (error) {
      console.error('좋아요상태 실패:', error);
    }
  };

   const handleTypeClick = (type: string) => {
     setSearchType(type);
     setActiveType(type);
   };

  const tabs = [
    { key: 'effectiveness', label: '효능•용법' },
    { key: 'review', label: '리뷰' }
  ];

  if (loading) {
    return <Loading />;
  }

  if (!pillData) {
    return <div className='searchInner'>검색 결과가 없습니다.</div>;
  }

  return (
    <>
      <SearchHeader
        activeType={activeType}
        handleTypeClick={handleTypeClick}
        setImageResults={() => {}}
      />
      <SearchResultsContainer>
        <PillInfo>
          <img src={pillData.imgurl} alt='알약' />
          <section>
            <PillHeader>
              <PillText>
                <h3>{formatTextWithLineBreaks(pillData.name)}</h3>
                <HeartButton onClick={handleToggleFavorite}>
                  <Icon
                    icon='mdi:heart'
                    style={{
                      color: isFavorite ? 'red' : 'gray'
                    }}
                    width='24'
                    height='24'
                  />
                  <p>{favoriteCount}</p>
                </HeartButton>
              </PillText>
              <span>{pillData.engname}</span>
              <p>{pillData.companyname}</p>
            </PillHeader>
            <TagContainer className='tagContainer'>
              {pillData.importantWords &&
                pillData.importantWords.trim() &&
                pillData.importantWords.split(', ').map((word) => (
                  <Tag
                    to={`/search/efficacy?q=${word}`}
                    key={word}
                    className='tag'
                  >
                    {word}
                  </Tag>
                ))}

              <InfoIconContainer onClick={() => setShowInfo(!showInfo)}>
                <Icon icon={informationOutline} width='24' height='24' />
              </InfoIconContainer>
              {showInfo && (
                <InfoBox>태그를 클릭해 관련 증상들을 모아보세요.</InfoBox>
              )}
            </TagContainer>
          </section>
        </PillInfo>
        <Exp>
          출처 :{' '}
          <a target='_blank' href={pillData.source}>
            {pillData.source}
          </a>
        </Exp>
        <PillMore>
          <Menu>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? 'active' : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </Menu>
          <Contants>
            {activeTab === 'effectiveness' ? (
              <PillExp />
            ) : (
              <Review pillId={pillId!} />
            )}
          </Contants>
        </PillMore>
      </SearchResultsContainer>
      <Nav />
    </>
  );
};

export default SearchResults;

const SearchResultsContainer = styled.div``;

const PillInfo = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80vw;
  margin: auto;

  & img {
    width: 35%;
  }

  & section {
    flex: 1;
    padding-left: 15px;
  }
`;

const PillHeader = styled.div`
  & p {
    padding-top: 5px;
    padding-bottom: 10px;
    font-size: 12px;
    font-weight: 300;
  }

  & span {
    color: #696969;
    font-size: 10px;
    font-style: italic;
  }
`;

const PillText = styled.div`
  display: flex;

  & h3 {
    font-size: 16px;
    font-weight: 500;
  }
`;

const HeartButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const TagContainer = styled.div`
  position: relative;
`;
const Tag = styled(Link)``;

const InfoIconContainer = styled.div`
  cursor: pointer;
`;

const InfoBox = styled.div`
  position: absolute;
  top: 90%;
  right: 0;
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  font-size: 14px;
`;

const Exp = styled.p`
  margin: 15px 20px;
  color: #696969;
  font-size: 14px;

  & a {
    color: inherit;
  }
`;

const PillMore = styled.div`
  margin-top: 30px;
`;

const Menu = styled.div`
  display: flex;
  border-bottom: 4px solid var(--main-color);

  & button {
    flex: 1;
    margin: 0;
    padding: 10px;
    text-align: center;
    border: none;
    background: none;
    cursor: pointer;
  }

  & button.active {
    border-radius: 10px 10px 0 0;
    background-color: var(--main-color);
  }
`;

const Contants = styled.div``;
