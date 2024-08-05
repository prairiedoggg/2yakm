import dayjs from 'dayjs';
import styled from 'styled-components';
import { calendarDelete } from '../../api/calendarApi';
import { useDateStore } from '../../store/calendar';
import EditDetailTextBox from './EditDetailTextBox';

const ContentContainer = styled.div`
  overflow: hidden;
`;

const OpenCalendarDetail: React.FC = () => {
  const { value, setEdit, setArrow, clearPosted, posted } = useDateStore();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');

  const handleDeleteCalender = async () => {
    clearPosted();
    try {
      const res = await calendarDelete(formattedDate);
      setEdit(false);
      setArrow(false);
      console.log(posted);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ContentContainer>
      <DeleteButtonContainer>
        <DeleteButton onClick={() => handleDeleteCalender()}>
          전체 삭제
        </DeleteButton>
      </DeleteButtonContainer>
      <EditDetailTextBox title='약 복용 여부' />
      <EditDetailTextBox title='혈당' />
      <EditDetailTextBox title='체온' />
      <EditDetailTextBox title='체중' />
      <EditDetailTextBox title='사진 기록' />
    </ContentContainer>
  );
};

export default OpenCalendarDetail;

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DeleteButton = styled.button`
  border-radius: 10px;
  border: none;
  height: 30px;
  padding: 0 10px;
  background-color: #e8e8e8;
`;
