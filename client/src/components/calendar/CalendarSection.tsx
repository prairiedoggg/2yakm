import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { calendarAllGet } from '../../api/calendarApi';
import { useDateStore } from '../../store/store';
import '../../styles/calendar.css';

interface CalendarDate {
  date: string;
  medications?: [];
  bloodsugarbefore: number;
  bloodsugarafter: number;
  temp: number;
  weight: number;
  photo: string;
}

interface TileContentProps {
  date: Date;
  view: string;
  calendarData: CalendarDate;
}

const CalendarSection: React.FC = () => {
  const { value, onChange, edit } = useDateStore();
  const [postArray, setPostArray] = useState<Set<string>>(new Set());
  const [calendarData, setData] = useState<CalendarDate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: CalendarDate[] = await calendarAllGet();
      setData(data);
      const datesWithMedications = new Set(
        data
          .filter((post) => post.medications && post.medications.length > 0)
          .map((post) => new Date(post.date).toDateString())
      );
      setPostArray(datesWithMedications);
    };

    fetchData();
  }, [edit, value]);

  const addContent = ({ date, view }: TileContentProps) => {
    if (view === 'month' && postArray.has(date.toDateString())) {
      return (
        <Pill
          src='/img/calendarPill.png'
          alt='pill icon'
          className='pill-icon'
        />
      );
    }

    const healthData = calendarData.find(
      (post) => new Date(post.date).toDateString() === date.toDateString()
    );

    if (
      view === 'month' &&
      healthData &&
      (healthData.bloodsugarafter ||
        healthData.bloodsugarbefore ||
        healthData.temp ||
        healthData.weight ||
        healthData.photo)
    ) {
      return (
        <Info
          src='/img/calendarInfo.png'
          alt='info icon'
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

const Info = styled.img`
  width: 15px;
`;

export default CalendarSection;
