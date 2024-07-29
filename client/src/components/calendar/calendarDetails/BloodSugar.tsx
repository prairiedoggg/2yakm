import ChangeTextColor from './ChangeTextColor';
import { useCalendar } from '../../../store/store';
import { useEffect } from 'react';

interface BloodSugarProps {
  bloodsugarbefore?: number;
  bloodsugarafter?: number;
}

const BloodSugar = ({ bloodsugarbefore, bloodsugarafter }: BloodSugarProps) => {
  const { setBloodSugarBefore, setBloodSugarAfter } = useCalendar();

  useEffect(() => {
    if (bloodsugarbefore !== undefined) {
      setBloodSugarBefore(bloodsugarbefore);
    }
    if (bloodsugarafter !== undefined) {
      setBloodSugarAfter(bloodsugarafter);
    }
  }, [
    bloodsugarbefore,
    bloodsugarafter,
    setBloodSugarBefore,
    setBloodSugarAfter
  ]);

  const getBloodSugarColor = (value: number, isFasted: boolean) => {
    if (isFasted) {
      return value < 100 ? '#23AF51' : value < 126 ? '#F78500' : '#EE3610';
    } else {
      return value < 140 ? '#23AF51' : value < 200 ? '#F78500' : '#EE3610';
    }
  };

  const handleBloodSugar = (isAfter: boolean) => {
    if (isAfter && bloodsugarafter !== undefined) {
      const color = getBloodSugarColor(bloodsugarafter, false);
      return <ChangeTextColor color={color} afterMeals={bloodsugarafter} />;
    } else if (bloodsugarafter === null) {
      return null;
    }

    if (!isAfter && bloodsugarbefore !== undefined) {
      const color = getBloodSugarColor(bloodsugarbefore, true);
      return <ChangeTextColor color={color} fasted={bloodsugarbefore} />;
    } else if (bloodsugarbefore === null) {
      return null;
    }

    return null;
  };

  return (
    <div>
      {bloodsugarbefore !== undefined && handleBloodSugar(false)}
      {bloodsugarafter !== undefined && handleBloodSugar(true)}
    </div>
  );
};

export default BloodSugar;
