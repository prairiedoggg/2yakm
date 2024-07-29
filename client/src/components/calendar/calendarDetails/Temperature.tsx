import ChangeTextColor from './ChangeTextColor';
import { styled } from 'styled-components';
import { useCalendar } from '../../../store/store';
import { useEffect } from 'react';

interface TemperatureProps {
  temp?: number;
}

const Temperature = ({ temp }: TemperatureProps) => {
  const { setTemp } = useCalendar();

  useEffect(() => {
    if (temp !== undefined) {
      setTemp(temp);
    }
  }, [temp, setTemp]);

  const handleTemperature = () => {
    if (!temp) return <ChangeTextColor color='#000000' />;
    const color =
      temp >= 39
        ? '#C20000'
        : temp >= 38
        ? '#F69999'
        : temp >= 37.2
        ? '#D8C100'
        : temp >= 35.8
        ? '#72BF44'
        : '#000000';
    return <ChangeTextColor temp={temp} color={color} />;
  };

  return (
    <>
      {handleTemperature()}
      <Unit>&nbsp;°C</Unit>
    </>
  );
};

export default Temperature;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;
