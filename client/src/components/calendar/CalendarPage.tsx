import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';
import Header from '../Header';
import Nav from '../Nav';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';

const CalendarPage: React.FC = () => {
  const { value, arrow, setArrow, edit, setEdit, setAddTaken } = useDateStore();

  dayjs.locale('ko');
  const days = dayjs(value).format('D. ddd');

  const openEdit = (open: boolean) => {
    if (!open) {
      setAddTaken(false);
      setEdit(false);
    } else {
      setEdit(true);
    }
    setArrow(true);
  };

  const handleModal = () => {
    setEdit(false);
    setAddTaken(false);
    setArrow(false);
  };

  return (
    <CalendarContainer>
      <Modal expanded={arrow} onClick={() => handleModal()} />
      <Header />
      <MainContent>
        <CalendarSection />
        <EntireDetail expanded={arrow}>
          <CalandarDatailContainer>
            <ImgContainer onClick={() => setArrow(!arrow)}>
              <Line />
            </ImgContainer>
            <TopContainer onClick={() => setArrow(true)}>
              <DateBox>{days}</DateBox>
              {!edit ? (
                <Icon
                  icon='uil:edit'
                  width='20px'
                  height='20px'
                  onClick={() => openEdit(true)}
                />
              ) : (
                <Icon
                  icon='uil:edit'
                  width='20px'
                  height='20px'
                  style={{ color: '#72bf44' }}
                  onClick={() => openEdit(false)}
                />
              )}
            </TopContainer>
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

const DateBox = styled.div`
  font-weight: 500;
  font-size: 14pt;
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

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export default CalendarPage;
