import { useEffect } from 'react';
import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/store';
import EditCalendarDatail from './EditCalendarDetail';
import OpenCalendarDetail from './OpenCalendarDetail';

const CalendarDetail: React.FC = () => {
  const { value, edit, setEdit, setNeverPost } = useDateStore();
  const { setCalendarData } = useCalendar();

  useEffect(() => {
    setEdit(false);
    setNeverPost(true);
    setCalendarData(null);
  }, [value]);

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
