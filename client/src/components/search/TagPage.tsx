import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { create } from 'zustand';
import Layout from '../Layout';
import {
  fetchPillListByEfficacy,
  fetchFavoriteCount,
  fetchReviewCount
} from '../../api/searchApi';
import { useSearchParams } from 'react-router-dom';
import Loading from '../Loading';
import NotSearched from './NotSearched';

export interface PillData {
  id: number;
  name: string;
  importantWords: string;
  imgurl: string;
}

interface PillStore {
  pillData: PillData[];
  setPillData: (data: PillData[]) => void;
  favoriteCounts: { [id: number]: number };
  setFavoriteCount: (id: number, count: number) => void;
  reviewCounts: { [id: number]: number };
  setReviewCount: (id: number, count: number) => void;
}

const usePillStore = create<PillStore>((set) => ({
  pillData: [],
  setPillData: (data) => set({ pillData: data }),
  favoriteCounts: {},
  setFavoriteCount: (id, count) =>
    set((state) => ({
      favoriteCounts: { ...state.favoriteCounts, [id]: count }
    })),
  reviewCounts: {},
  setReviewCount: (id, count) =>
    set((state) => ({
      reviewCounts: { ...state.reviewCounts, [id]: count }
    }))
}));

const TagPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const {
    pillData,
    setPillData,
    favoriteCounts,
    setFavoriteCount,
    reviewCounts,
    setReviewCount
  } = usePillStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPillListByEfficacy(query, 10, 10);
        console.log('효능 데이터:', data);
        setPillData(data);

        await Promise.all(
          data.map(async (pill: PillData) => {
            const favoritecount = await fetchFavoriteCount(pill.id); 
            setFavoriteCount(pill.id, favoritecount);
            const reviewcount = await fetchReviewCount(pill.id.toString());
            setReviewCount(pill.id, reviewcount);
          })
        );
      } catch (error) {
        console.log('효능 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  if (loading) {
    return <Loading />;
  }

  if (!pillData || pillData.length === 0) {
    return (
      <>
        <NotSearched />
      </>
    );
  }

  return (
    <>
      <Layout />
      <TagTitle>{query}</TagTitle>
      <ListContainer>
        <p>좋아요 개수로 정렬되었습니다.</p>
        <PillList>
          {pillData.map((pill: PillData) => (
            <PillItem key={pill.id}>
              <StyledLink
                to={`/search/name?q=${encodeURIComponent(pill.name)}`}
              >
                <PillImg src={pill.imgurl} alt={pill.name}></PillImg>
                <PillText>
                  <PillTitle>
                    <h3>{pill.name}</h3>
                    <img src='/img/arrow.svg' alt='더보기' />
                  </PillTitle>
                  <FavoritesCount>
                    <p>즐겨찾기 {favoriteCounts[pill.id] || 0}</p>
                    <p>리뷰 {reviewCounts[pill.id] || 0}</p>
                  </FavoritesCount>
                  <TagContainer className='tagContainer'>
                    {pill.importantWords &&
                      pill.importantWords.trim() &&
                      pill.importantWords.split(', ').map((word) => (
                        <Tag
                          to={`/search/efficacy?q=${word}`}
                          key={word}
                          className='tag'
                        >
                          {word}
                        </Tag>
                      ))}
                  </TagContainer>
                </PillText>
              </StyledLink>
            </PillItem>
          ))}
        </PillList>
      </ListContainer>
    </>
  );
};

export default TagPage;

const TagTitle = styled.div`
  height: 50px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  background-color: var(--main-color);
`;

const ListContainer = styled.div`
  padding-bottom: 100px;
  margin: auto;
  width: 85vw;
  > p {
    padding-top: 10px;
    color: #696969;
    font-size: 14px;
    font-style: italic;
  }
`;

const PillList = styled.ul``;

const PillItem = styled.li`

  margin-top: 20px;
  color: black;
  text-decoration: none;
`;

const StyledLink = styled(Link)`
  display: flex;
  width: 100%;
  color: black;
  text-decoration: none;
`;

const PillImg = styled.img`
  width: 120px;
`;

const PillText = styled.div`
  margin-left: 15px;
`;

const PillTitle = styled.div`
  display: flex;
  align-items: center;

  & h3 {
    font-size: 16px;
    font-weight: 400;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  & img {
    margin-left: 5px;
  }
`;

const FavoritesCount = styled.div`
  display: flex;
  margin: 8px 0;
  & p {
    font-size: 14px;
    font-weight: 300;
    margin-right: 8px;
  }
`;

const TagContainer = styled.div``;

const Tag = styled(Link)``;
