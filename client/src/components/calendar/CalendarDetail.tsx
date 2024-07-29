import styled from 'styled-components';
import { useDateStore, useCalendar } from '../../store/store';
import OpenCalendarDetail from './OpenCalendarDetail';
import EditCalendarDatail from './EditCalendarDetail';
import { useEffect } from 'react';

const CalendarDetail: React.FC = () => {
  const { value, edit, setEdit, setNeverPost } = useDateStore();
  const {
    setPillData,
    setBloodSugarAfter,
    setBloodSugarBefore,
    setTemp,
    setWeight,
    setPhoto
  } = useCalendar();

  useEffect(() => {
    setEdit(false);
    setPillData([]);
    setBloodSugarAfter(null);
    setBloodSugarBefore(null);
    setTemp(null);
    setWeight(null);
    setPhoto(null);
    setNeverPost(true);
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
