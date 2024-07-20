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
  position: relative;
`;

const CalendarPage: React.FC = () => {
  return (
    <CalendarContainer>
      <Header />
      <MainContent>
        <CalendarSection />
        <DetailContainer>
          <CalendarDetail />
        </DetailContainer>
      </MainContent>
      <Nav />
    </CalendarContainer>
  );
};

export default CalendarPage;
