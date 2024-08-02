import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { calendarGet, calendarPost, calendarPut } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import DetailTextBox from './DetailTextBox';

interface CalendarData {
  medications?: {
    name?: string;
    time?: string[];
    taken?: boolean[];
  }[];
  bloodsugarBefore?: number;
  bloodsugarAfter?: number;
  temperature?: number;
  weight?: number;
  calImg?: string;
}

const OpenCalendarDetail: React.FC = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const { calendarData, calImg } = useCalendar();
  const { value, edit, posted, addPosted } = useDateStore();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const [data, setData] = useState<CalendarData | null>(null);
  let isPosted = posted.find((item) => item.date === formattedDate)
    ? true
    : false;

  useEffect(() => {
    if (isPosted === true) {
      const fetchPillData = async () => {
        try {
          const data = await calendarGet(today);
          console.log(data);
          setData(data);
          addPosted({ date: formattedDate, post: true });
        } catch (err) {
          console.log('해당하는 약복용여부 정보 없음', err);
        }
      };

      fetchPillData();
    }
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append('date', formattedDate);
    formData.append(
      'bloodsugarBefore',
      calendarData?.bloodsugarbefore?.toString() || '0'
    );
    formData.append(
      'bloodsugarAfter',
      calendarData?.bloodsugarafter?.toString() || '0'
    );
    formData.append(
      'medications',
      JSON.stringify(calendarData?.pillData) || '[]'
    );
    formData.append('temperature', calendarData?.temp?.toString() || '0');
    formData.append('weight', calendarData?.weight?.toString() || '0');
    formData.append('calImg', calImg?.get('file') as Blob);

    const putData = async () => {
      try {
        if (!edit) {
          if (isPosted) {
            const res = await calendarPut(formattedDate, formData);
            setData(res);
            console.log('일정 수정 성공:', res);
          }
        } else {
          const res = await calendarPost(formData);
          setData(res);
          console.log('일정 등록 성공', res);
          addPosted({ date: formattedDate, post: true });
        }
      } catch (err) {
        console.error('일정 등록/수정 오류:', err);
      }
    };
    putData();
  }, [edit]);

  useEffect(() => {
    console.log(formattedDate, isPosted);
    if (formattedDate !== undefined && isPosted === true) {
      const fetchPillData = async () => {
        try {
          const data = await calendarGet(formattedDate);
          console.log(data);
          setData(data);
          addPosted({ date: formattedDate, post: true });
        } catch (err) {
          console.log('해당하는 약복용여부 정보 없음', err);
        }
      };

      fetchPillData();
    } else if (isPosted === false) {
      setData(null);
    }
  }, [formattedDate]);

  return (
    <ContentContainer>
      <DetailTextBox title='약 복용 여부' pillData={data?.medications} />
      <DetailTextBox
        title='혈당'
        bloodsugarbefore={data?.bloodsugarBefore}
        bloodsugarafter={data?.bloodsugarAfter}
      />
      <DetailTextBox title='체온' temp={data?.temperature} />
      <DetailTextBox title='체중' weight={data?.weight} />
      <DetailTextBox title='사진 기록' photo={data?.calImg} />
    </ContentContainer>
  );
};

const ContentContainer = styled.div``;

export default OpenCalendarDetail;
