import styled from 'styled-components';
import { PillData, usePillStore } from '../../store/pill';

const ImageSearchList = ({ pills }: { pills: PillData[] }) => {
  const { setPillData } = usePillStore();

  const handleItemClick = (pill: PillData) => {
    setPillData(pill);
  };

  return (
    <ListContainer>
      {pills.map((pill) => (
        <ListItem
          key={pill.id}
          onClick={() => {
            handleItemClick(pill);
          }}
        >
          <p>{pill.name}</p>
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default ImageSearchList;

const ListContainer = styled.div``;

const ListItem = styled.div``;
