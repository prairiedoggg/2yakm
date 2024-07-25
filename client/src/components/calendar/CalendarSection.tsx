import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';
import styled from 'styled-components';
import { useDateStore } from '../../store/store';

const CalendarSection: React.FC = () => {
  const { value, onChange } = useDateStore();

  // const addContent = (/*{
  //   date,
  //   view
  // }: {
  //   date: Date;
  //   view: string;
  // }*/): JSX.Element => {
  //   return (
  //     <>
  //       <Pill />
  //     </>
  //   );
  // };

  const getDayClassName = ({ date }: { date: Date }) => {
    const SUNDAY = 0;
    const SATURDAY = 6;

    if (date.getDay() === SUNDAY) {
      return 'sunday';
    }
    if (date.getDay() === SATURDAY) {
      return 'saturday';
    }

    return '';
  };

  return (
    <>
      <CalendarContainer>
        <Calendar
          onChange={onChange}
          value={value}
          calendarType='gregory'
          formatDay={(locale, date) => dayjs(date).format('D')}
          // 날짜 칸에 보여지는 컨텐츠 (우리는 알약)
          // tileContent={addContent}
          // 앞뒤 달의 이어지는 날짜 보여주기 여부
          showNeighboringMonth={true}
          tileClassName={getDayClassName}
        />
      </CalendarContainer>
    </>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Pill = styled.img.attrs({
//   src: '/img/pharm.png',
//   alt: 'pill icon'
// })`
//   width: 15px;
//   height: auto;
// `;

export default CalendarSection;
