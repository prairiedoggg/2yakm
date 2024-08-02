import dayjs from 'dayjs';
import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';
import Header from '../Header';
import Nav from '../Nav';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';

const CalendarPage: React.FC = () => {
  const { value, arrow, setArrow, setEdit, setAddTaken } = useDateStore();

  dayjs.locale('ko');
  const days = dayjs(value).format('D. ddd');

  const closeEdit = () => {
    setArrow(false);
    setEdit(false);
    setAddTaken(false);
  };

  return (
    <CalendarContainer>
      <Modal expanded={arrow} onClick={closeEdit} />
      <Header />
      <MainContent>
        <CalendarSection />
        <EntireDetail expanded={arrow}>
          <CalandarDatailContainer>
            <ImgContainer onClick={setArrow}>
              <Line />
            </ImgContainer>
            <DateContainer>
              <DateBox>{days}</DateBox>
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

const CalendarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EntireDetail = styled.div<{ expanded: boolean }>`
  position: ${({ expanded }) => (expanded ? 'absolute' : 'relative')};
  bottom: ${({ expanded }) => (expanded ? '80px' : '0')};
  width: 100%;
  height: ${({ expanded }) => (expanded ? '65%' : 'auto')};
  margin-bottom: ${({ expanded }) => (expanded ? 'auto' : '80px')};
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height 0.7s ease-out, bottom 0.7s ease-out;
  border-top-left-radius: ${({ expanded }) => (expanded ? '20px' : '0')};
  border-top-right-radius: ${({ expanded }) => (expanded ? '20px' : '0')};
  z-index: 10;
`;

const CalandarDatailContainer = styled.div`
  padding: 5px 25px;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Line = styled.div`
  width: 80px;
  height: 3px;
  background-color: #a9a9a9;
  border-radius: 10px;
  margin: 10px;
`;

const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const DateBox = styled.div`
  font-weight: 500;
  font-size: 14pt;
`;

const Edit = styled.button<{ src: string }>`
  width: 18px;
  height: 18px;
  background: url(${(props) => props.src}) no-repeat center center;
  background-size: contain;
  border: none;
  cursor: pointer;
`;

const DetailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
`;

const Modal = styled.div<{ expanded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: ${({ expanded }) => (expanded ? '10' : '-1')};
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
`;

export default CalendarPage;
