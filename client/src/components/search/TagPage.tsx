import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../Layout';
import { fetchPillListByEfficacy } from '../../api/searchApi';
import { fetchFavoriteCount } from '../../api/favoriteApi';
import { fetchReviewCount } from '../../api/reviewApi';
import { useSearchParams } from 'react-router-dom';
import Loading from '../Loading';

export interface PillData {
  id: number;
  name: string;
  importantWords: string;
  imgurl: string;
}

const TagPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [pillData, setPillData] = useState<PillData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPillListByEfficacy(query, 10, 10);
        console.log('효능 데이터:', data);
        setPillData(data);

        if (data.length > 0) {
          const favoritecount = await fetchFavoriteCount(data[0].id);
          setFavoriteCount(favoritecount);
          const reviewcount = await fetchReviewCount(data[0].id);
          setReviewCount(reviewcount);
        }
      } catch (error) {
        console.log('효능 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, setFavoriteCount, setReviewCount]);

  if (loading) {
    return <Loading />;
  }

  if (!pillData || pillData.length === 0) {
    return <div className='searchInner'>검색 결과가 없습니다.</div>;
  }

  return (
    <>
      <Layout />
      <TagTitle>{query}</TagTitle>
      <ListContainer>
        <p>좋아요 개수로 정렬되었습니다.</p>
        <PillList>
          {pillData.map((pill: PillData) => (
            <PillItem
              to={`/search/name?q=${encodeURIComponent(pill.name)}`}
              key={pill.id}
            >
              <PillImg src={pill.imgurl} alt={pill.name}></PillImg>
              <PillText>
                <PillTitle>
                  <h3>{pill.name}</h3>
                  <img src='/img/arrow.svg' alt='더보기' />
                </PillTitle>
                <FavoritesCount>
                  <p>즐겨찾기 {favoriteCount}</p>
                  <p>리뷰 {reviewCount}</p>
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

const PillItem = styled(Link)`
  display: flex;
  margin-top: 20px;
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
