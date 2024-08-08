import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PillData, usePillStore } from '../../store/pill';
import Loading from '../Loading';
import { useEffect } from 'react';
import { useSearchStore } from '../../store/search';

const ImageSearchList = ({ pills }: { pills: PillData[] | null }) => {
  const { setPillData, loading } = usePillStore();
  const { setIsImageSearch } = useSearchStore();

  const handleItemClick = (pill: PillData) => {
    setPillData(pill);
  };

  useEffect(() => {
    return () => setIsImageSearch(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='searchInner'>
      <p className='listTitle'>이미지로 검색결과</p>
      {(pills ?? []).map((pill) => (
        <ListItem
          to={`/search/name?q=${pill.name}`}
          key={pill.id}
          onClick={() => {
            handleItemClick(pill);
          }}
          className='listItem'
        >
          <img src={pill.imgurl} alt='알약' />
          <div>
            <p>{pill.name}</p>
            <p>{pill.similarity}</p>
          </div>
        </ListItem>
      ))}
    </div>
  );
};

export default ImageSearchList;

const ListItem = styled(Link)`
  display: flex;

  & img {
    width: 50px;
  }

  & div {
    margin-left: 10px;
  }
`;
