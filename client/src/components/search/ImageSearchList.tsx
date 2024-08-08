import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PillData, usePillStore } from '../../store/pill';
import Loading from '../Loading';

const ImageSearchList = ({ pills }: { pills: PillData[] }) => {
  const { setPillData, loading } = usePillStore();

  const handleItemClick = (pill: PillData) => {
    setPillData(pill);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='searchInner'>
      <p className='listTitle'>이미지로 검색결과</p>
      {pills.map((pill) => (
        <ListItem
          to={`/search/name?q=${pill.name}`}
          key={pill.id}
          onClick={() => {
            handleItemClick(pill);
          }}
          className='listItem'
        >
          <img src={pill.imgurl} alt='알약' />
          <span>{pill.name}</span>
          <span>{pill.similarity}</span>
        </ListItem>
      ))}
    </div>
  );
};

export default ImageSearchList;

const ListItem = styled(Link)`
  & img {
    width: 50px;
  } 
`;
