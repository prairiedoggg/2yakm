import dayjs from 'dayjs';
import Cookies from 'js-cookie';
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
  const login = Cookies.get('login');
  const { calendarData, calImg } = useCalendar();
  const { value, edit, posted, addPosted } = useDateStore();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const [data, setData] = useState<CalendarData | null>(null);
  let isPosted = posted.find((item) => item.date === formattedDate)
    ? true
    : false;

  useEffect(() => {
    if (isPosted && login) {
      const fetchPillData = async () => {
        try {
          const data = await calendarGet(today);
          setData(data);
          addPosted({ date: formattedDate, post: true });
        } catch (err) {
          console.log('해당하는 약복용여부 정보 없음', err);
        }
      };
      fetchPillData();
    }
  }, [login]);

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
          } else {
            const res = await calendarPost(formData);
            setData(res);
            addPosted({ date: formattedDate, post: true });
          }
        }
      } catch (err) {
        console.log('일정 등록/수정 오류:', err);
      }
    };
    putData();
  }, [edit]);

  useEffect(() => {
    if (formattedDate !== undefined && isPosted && login) {
      const fetchPillData = async () => {
        try {
          const data = await calendarGet(formattedDate);
          setData(data);
          addPosted({ date: formattedDate, post: true });
        } catch (err) {
          console.log('해당하는 약복용여부 정보 없음', err);
        }
      };

      fetchPillData();
    } else if (!isPosted) {
      setData(null);
    }
  }, [formattedDate, edit]);

  const hasContent = (name: string) => {
    switch (name) {
      case 'medications':
        return data?.medications && data.medications.length > 0;
      case 'bloodsugarBefore':
        return (
          data?.bloodsugarBefore !== undefined && data.bloodsugarBefore !== 0
        );
      case 'bloodsugarAfter':
        return (
          data?.bloodsugarAfter !== undefined && data.bloodsugarAfter !== 0
        );
      case 'temperature':
        return data?.temperature !== undefined && data.temperature !== 0;
      case 'weight':
        return data?.weight !== undefined && data.weight !== 0;
      case 'calImg':
        return data?.calImg !== undefined && data.calImg !== null;
      default:
        return false;
    }
  };

  const detailBoxes = [
    {
      title: '약 복용 여부',
      name: 'medications',
      component: (
        <DetailTextBox title='약 복용 여부' pillData={data?.medications} />
      )
    },
    {
      title: '혈당',
      name: 'bloodsugarBefore',
      component: (
        <DetailTextBox
          title='혈당'
          bloodsugarbefore={data?.bloodsugarBefore}
          bloodsugarafter={data?.bloodsugarAfter}
        />
      )
    },
    {
      title: '체온',
      name: 'temperature',
      component: <DetailTextBox title='체온' temp={data?.temperature} />
    },
    {
      title: '체중',
      name: 'weight',
      component: <DetailTextBox title='체중' weight={data?.weight} />
    },
    {
      title: '사진 기록',
      name: 'calImg',
      component: <DetailTextBox title='사진 기록' photo={data?.calImg} />
    }
  ];

  const withContent = detailBoxes.filter((box) => hasContent(box.name));
  const withoutContent = detailBoxes.filter((box) => !hasContent(box.name));

  return (
    <ContentContainer>
      {withContent.map((box) => box.component)}
      {withoutContent.map((box) => box.component)}
    </ContentContainer>
  );
};

const ContentContainer = styled.div``;

export default OpenCalendarDetail;
