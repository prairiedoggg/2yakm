import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';
import styled from 'styled-components';
import { useDateStore } from '../../store/store';
import { calendarAllGet } from '../../api/calendarApi';
import { useEffect, useState } from 'react';

interface CalendarDate {
  date: string;
  medications?: [];
}

interface TileContent {
  date: Date;
  view: string;
}

const CalendarSection: React.FC = () => {
  const { value, onChange, edit } = useDateStore();
  const [postArray, setPostArray] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const data: CalendarDate[] = await calendarAllGet();
      const datesWithMedications = new Set(
        data
          .filter((post) => post.medications && post.medications.length > 0)
          .map((post) => new Date(post.date).toDateString())
      );
      setPostArray(datesWithMedications);
    };

    fetchData();
  }, [edit]);

  const addContent = ({ date, view }: TileContent) => {
    if (view === 'month' && postArray.has(date.toDateString())) {
      return (
        <Pill
          src='/img/calendarPill.png'
          alt='pill icon'
          className='pill-icon'
        />
      );
    }
    return null;
  };

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
    <CalendarContainer>
      <Calendar
        onChange={onChange}
        value={value}
        calendarType='gregory'
        formatDay={(locale, date) => dayjs(date).format('D')}
        tileContent={addContent}
        showNeighboringMonth={true}
        tileClassName={getDayClassName}
        className={`react-calendar ${
          (value as any).view === 'decade' ? 'react-calendar--decade-view' : ''
        } ${(value as any).view === 'year' ? 'react-calendar--year-view' : ''}`}
      />
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Pill = styled.img`
  width: 14px;
  height: auto;
`;

export default CalendarSection;
