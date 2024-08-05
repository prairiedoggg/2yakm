import { useEffect } from 'react';
import { styled } from 'styled-components';
import { useCalendar } from '../../../store/calendar';

interface WeightProps {
  weight?: number;
}

const Weight = ({ weight }: WeightProps) => {
  const { setWeight } = useCalendar();
  useEffect(() => {
    if (weight !== undefined) {
      setWeight(weight);
    }
  }, [weight, setWeight]);

  return (
    <>
      <Text style={{ fontWeight: '600' }}>{weight}</Text>
      <Unit>&nbsp;kg</Unit>
    </>
  );
};

export default Weight;

const Text = styled.div`
  font-size: 15pt;
`;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;
