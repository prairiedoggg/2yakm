import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';

const EditPill = () => {
  const { setEditTaken } = useDateStore();

  return (
    <EditPillContainer>
      <Icon icon='ph:plus-fill' />
      {<button onClick={() => setEditTaken(false)}>완료</button>}
    </EditPillContainer>
  );
};

export default EditPill;

const EditPillContainer = styled.div``;
