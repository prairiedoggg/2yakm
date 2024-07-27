import styled from 'styled-components';
import Header from '../Header';
import dayjs from 'dayjs';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';
import Nav from '../Nav';
import { useDateStore } from '../../store/store';
import { get, post } from '../../api/api';

const CalendarPage: React.FC = () => {
  const { value, arrow, setArrow, edit, setEdit } = useDateStore();

  get('http://localhost:3000/api/calendars')
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

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
      <Modal expanded={arrow} onClick={setArrow} />
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
  height: ${({ expanded }) => (expanded ? '60%' : 'auto')};
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
