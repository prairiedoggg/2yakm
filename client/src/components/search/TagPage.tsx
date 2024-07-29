import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components'; 
import Layout from '../Layout'
import { fetchPillDataByEfficacy } from '../../api/pillApi';


const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [pillData, setPillData] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => { 
    const fetchData = async () => { 
      setLoading(true)
      try {
        const data = await fetchPillDataByEfficacy(tag, 10, 0)
        console.log('효능 데이터:', data)
        setPillData(data)
      } catch (error) {
        console.log('효능 데이터 가져오기 실패:', error)
      } finally { 
        setLoading(false)
      }
    }
    fetchData()
  }, [tag])

  if (loading) { 
    return <div>데이터 검색중입니다.</div>
  }

  if (!pillData) {
    return <div>검색 결과가 없습니다.</div>
  }

  return (
    <>
      <Layout/>
      <TagTitle>{tag}</TagTitle>
      <ListContainer>
        <p>즐겨찾기 개수로 정렬되었습니다.</p>
        <PillList>
          <PillItem>
            <PillImg src={`/img/pill.png`} alt='유저'></PillImg>
            <PillText>
              <PillTitle>
                <h3>타이레놀정500밀리그람 (아세트아미노펜)</h3>
                <img src='/img/arrow.svg' alt='더보기' />
              </PillTitle>
              <FavoritesCount>
                <p>즐겨찾기 1024</p>
                <p>리뷰 512</p>
              </FavoritesCount>
              <TagContainer>
                <Tag>두통</Tag>
                <Tag>신경통</Tag>
                <Tag>근육통</Tag>
              </TagContainer>
            </PillText>
          </PillItem>
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
  display: flex;
  margin-top: 20px;
`;

const PillImg = styled.img`
  width: 120px;
`;

const PillText = styled.div`
  margin-left: 30px;
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

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`;

const Tag = styled.p`
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
`;