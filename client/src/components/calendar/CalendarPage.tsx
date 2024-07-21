/**
File Name : CalendarPage
Description : 캘린더 페이지
Author : 임지영

History
Date        Author   Status    Description
2024.07.17  임지영   Created
2024.07.18  임지영   Modified    tsx
2024.07.22  임지영   Modified   스타일 변경
*/

import styled from 'styled-components';
import Header from '../Header';
import dayjs from 'dayjs';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';
import Nav from '../Nav';
import { useDateStore } from '../../store/store';

const EntireDetail = styled.div<{ expanded: boolean }>`
  position: ${({ expanded }) => (expanded ? 'absolute' : 'relative')};
  bottom: ${({ expanded }) => (expanded ? '80px' : '0')};
  width: 100%;
  height: ${({ expanded }) => (expanded ? '60%' : 'auto')};
  margin-bottom: ${({ expanded }) => (expanded ? 'auto' : '80px')};
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height 0.7s ease-out, bottom 0.7s ease-out;
`;

const CalandarDatailContainer = styled.div`
  padding: 5px 25px;
`;

const ImgContainer = styled.div`
  text-align: center;
  margin: 5px 0;
`;

const Arrow = styled.img`
  width: 20px;
  height: auto;
  cursor: pointer;
`;

const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DateBox = styled.div`
  font-weight: 500;
  font-size: 14pt;
`;

const Edit = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CalendarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DetailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
`;

const CalendarPage: React.FC = () => {
  const { value, arrow, setArrow, edit, setEdit } = useDateStore();

  dayjs.locale('ko');
  const days = dayjs(value).format('D. ddd');

  const handleSrc = (img: 'edit' | 'arrow') => {
    if (img === 'edit') {
      return edit ? '/img/editing.png' : '/img/calendarEdit.png';
    } else if (img === 'arrow') {
      return arrow ? '/img/calendarArrowDown.png' : '/img/calendarArrow.png';
    }
  };

  const handleEdit = () => {
    setEdit();
  };

  return (
    <CalendarContainer>
      <Header />
      <MainContent>
        <CalendarSection />
        <EntireDetail expanded={arrow}>
          <CalandarDatailContainer>
            <ImgContainer>
              <Arrow
                src={handleSrc('arrow')}
                alt='Arrow Icon'
                onClick={setArrow}
              />
            </ImgContainer>
            <DateContainer>
              <DateBox>{days}</DateBox>
              <Edit
                src={handleSrc('edit')}
                alt='Edit Button'
                onClick={handleEdit}
              />
            </DateContainer>
          </CalandarDatailContainer>
          <DetailContainer>
            <CalendarDetail />
          </DetailContainer>
        </EntireDetail>
      </MainContent>
      <Nav />
    </CalendarContainer>
  );
};

export default CalendarPage;
