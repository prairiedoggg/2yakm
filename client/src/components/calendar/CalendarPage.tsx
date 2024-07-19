/**
File Name : CalendarPage
Description : 캘린더 페이지
Author : 임지영

History
Date        Author   Status    Description
2024.07.17  임지영   Created
2024.07.18  임지영   Modified    tsx
*/

import styled from 'styled-components';
import Header from '../Header';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';
import Nav from '../Nav';

const CalendarContainer = styled.div`
  width: 100vw;
  position: relative;
`;

const CalendarPage: React.FC = () => {
  return (
    <CalendarContainer>
      <Header />
      <CalendarSection />
      <CalendarDetail />
      <Nav />
    </CalendarContainer>
  );
};

export default CalendarPage;
