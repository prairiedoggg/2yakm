/**
File Name : CalendarSection
Description : 달력 부분
Author : 임지영

History
Date        Author   Status    Description
2024.07.17  임지영   Created
2024.07.18  임지영   Modified     tsx
2024.07.21  임지영   Modified    코치님 코드 리뷰 수정 (dayjs, 주석)
*/

import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';
import styled from 'styled-components';
import { useDateStore } from '../../store/store';

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
          // prev2Label={null}
          // next2Label={null}
          // 일 없이 날짜 숫자만
          formatDay={(locale, date) => dayjs(date).format('D')}
          // 날짜 칸에 보여지는 컨텐츠 (우리는 알약)
          // tileContent={addContent}
          // 앞뒤 달의 이어지는 날짜 보여주기 여부
          showNeighboringMonth={true}
          // 토요일, 일요일 색상 변경
          tileClassName={getDayClassName}
        />
      </CalendarContainer>
    </>
  );
};

export default CalendarSection;
