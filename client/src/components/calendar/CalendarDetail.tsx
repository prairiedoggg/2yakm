import { useEffect } from 'react';
import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/calendar';
import AddPill from './AddPill';
import EditCalendarDatail from './EditCalendarDetail';
import OpenCalendarDetail from './OpenCalendarDetail';

const CalendarDetail: React.FC = () => {
  const { value, edit, setEdit, addTaken, setAddTaken } = useDateStore();
  const { setCalendarData } = useCalendar();

  useEffect(() => {
    setEdit(false);
    setCalendarData(null);
    setAddTaken(false);
  }, [value]);

  return (
    <CalandarDatailContainer>
      {addTaken ? (
        <AddPill />
      ) : edit ? (
        <EditCalendarDatail />
      ) : (
        <OpenCalendarDetail />
      )}
    </CalandarDatailContainer>
  );
};

const CalandarDatailContainer = styled.div`
  background-color: #ffffff;
  padding: 5px 25px;
  overflow-y: auto;
`;

export default CalendarDetail;
