import { useEffect } from 'react';
import { calendarPut } from '../../api/calendarApi';

interface edit {
  formattedDate: string;
  edit: boolean;
  pillData: string[];
  bloodsugarbefore: number;
  bloodsugarafter: number;
  temp: number;
  weight: number;
  photo: string;
}

export const editDetails = ({
  formattedDate,
  edit,
  pillData,
  bloodsugarbefore,
  bloodsugarafter,
  temp,
  weight,
  photo
}: edit) => {
  useEffect(() => {
    const putData = async () => {
      if (!edit) {
        try {
          const res = await calendarPut(formattedDate, {
            date: formattedDate,
            weight,
            temperature: temp,
            bloodsugarBefore: bloodsugarbefore,
            bloodsugarAfter: bloodsugarafter,
            medications: pillData,
            calimg: photo
          });
          console.log('일정 수정 성공:', res.data);
        } catch (err) {
          console.error('일정 수정 오류:', err);
        }
      }
    };
    putData();
  }, [
    edit,
    formattedDate,
    pillData,
    bloodsugarbefore,
    bloodsugarafter,
    temp,
    weight,
    photo
  ]);
};
