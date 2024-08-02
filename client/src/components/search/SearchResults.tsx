import { Icon } from '@iconify-icon/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchFavoriteCount,
  fetchFavoriteStatusApi,
  toggleFavoriteApi
} from '../../api/favoriteApi';
import { fetchPillDataByName } from '../../api/searchApi';
import { useFavoriteStore } from '../../store/favorite';
import { usePillStore } from '../../store/pill';
import { useSearchStore } from '../../store/search';
import PillExp from './PillExp';
import Review from './Review';

const SearchResults = () => {
  const { searchQuery } = useSearchStore();
  const { pillData, setPillData } = usePillStore();
  const { isFavorite, setIsFavorite, favoriteCount, setFavoriteCount } =
    useFavoriteStore();
  const [activeTab, setActiveTab] = useState<string>('effectiveness');
  const [pillId, setPillId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPillDataByName(searchQuery, 1, 0);
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
  }, [searchQuery, setIsFavorite, setPillData]);

  const handleToggleFavorite = async () => {
    if (!pillId) return;
    try {
      await toggleFavoriteApi(pillId!.toString());
      setIsFavorite(!isFavorite);
      const count = await fetchFavoriteCount(pillId!.toString());
      setFavoriteCount(count);
    } catch (error) {
      console.error('좋아요상태 실패:', error);
    }
  };

  const tabs = [
    { key: 'effectiveness', label: '효능•용법' },
    { key: 'review', label: '리뷰' }
  ];
  if (loading) {
    return <div>데이터 검색중입니다.</div>;
  }

  if (!pillData) {
    return <div>검색 결과가 없습니다.</div>;
  }

  return (
    <SearchResultsContainer>
      <PillInfo>
        <img src={`/img/pill.png`} alt='pill' />
        <section>
          <PillHeader>
            <PillTitle>
              <h3>{pillData.name}</h3>
              <HeartButton onClick={handleToggleFavorite}>
                <Icon
                  icon='mdi:heart'
                  style={{
                    color: isFavorite ? 'gray' : 'red'
                  }}
                  width='24'
                  height='24'
                />
                <p>{favoriteCount}</p>
              </HeartButton>
            </PillTitle>
            <span>{pillData.engname}</span>
            <p>{pillData.companyname}</p>
          </PillHeader>
          <TagContainer>
            {pillData.importantWords &&
              pillData.importantWords.trim() &&
              pillData.importantWords.split(', ').map((word) => (
                <Tag to={`/search/tag/:${word}`} key={word}>
                  {word}
                </Tag>
              ))}
          </TagContainer>
        </section>
      </PillInfo>
      <Exp>※ 태그들을 클릭해 관련 증상들을 모아보세요.</Exp>
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
  );
};

export default SearchResults;

const SearchResultsContainer = styled.div``;

const PillInfo = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80vw;
  margin: auto;

  & section {
    margin-left: 30px;
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

const PillTitle = styled.div`
  display: flex;
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`;

const Tag = styled(Link)`
  width: 48px;
  height: 25px;
  margin-right: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 25px;
  border-radius: 5px;
  background-color: var(--main-color);
  cursor: pointer;
  text-decoration: none;
  color: black;
`;

const Exp = styled.p`
  margin: 15px 20px;
  color: #696969;
  font-size: 14px;
  text-align: end;
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
