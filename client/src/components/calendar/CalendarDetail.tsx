import styled from 'styled-components';
import { useDateStore } from '../../store/store';
import OpenCalendarDetail from './OpenCalendarDetail';
import EditCalendarDatail from './EditCalendarDetail';

const CalendarDetail: React.FC = () => {
  const { edit } = useDateStore();

  return (
    <CalandarDatailContainer>
      {edit ? <EditCalendarDatail /> : <OpenCalendarDetail />}
    </CalandarDatailContainer>
  );
};

const CalandarDatailContainer = styled.div`
  background-color: #ffffff;
  padding: 5px 25px;
  overflow-y: auto;
`;

export default CalendarDetail;
