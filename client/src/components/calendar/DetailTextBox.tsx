import styled from 'styled-components';

interface ColorTextProps {
  temp?: number;
  fasted?: number;
  afterMeals?: number;
  color: string;
}

// 색상 변화
const ColorText = ({ color, temp, fasted, afterMeals }: ColorTextProps) => {
  return (
    <TextContainer>
      {fasted !== undefined && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          공복 혈당:&nbsp;
        </Text>
      )}
      {afterMeals !== undefined && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          식후 혈당:&nbsp;
        </Text>
      )}
      <Text style={{ color, fontWeight: '600' }}>
        {temp !== undefined && <Text>{temp}</Text>}
        {fasted !== undefined && <Blood>{fasted}</Blood>}
        {afterMeals !== undefined && <Blood>{afterMeals}</Blood>}
      </Text>
      {(fasted !== undefined || afterMeals !== undefined) && (
        <Unit>&nbsp;mg/dL</Unit>
      )}
    </TextContainer>
  );
};

interface DetailTextBoxProps {
  title: string;
  time?: string[][];
  pillName?: string[];
  isPillTaken?: boolean[][]; // 배열로 수정
  bloodSugar?: number[];
  temp?: number;
  weight?: number;
  photo?: boolean;
}

const DetailTextBox = ({
  title,
  pillName,
  time,
  isPillTaken,
  bloodSugar,
  temp,
  weight,
  photo
}: DetailTextBoxProps) => {
  // 약 복용 여부
  const handleIsTakenPill = (times: string[], takenStatuses: boolean[]) => {
    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput type='checkbox' checked={takenStatuses[index]} />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  // 혈당에 따른 글자색 변화
  const getBloodSugarColor = (value: number, isFasted: boolean) => {
    if (isFasted) {
      return value < 100 ? '#23AF51' : value < 126 ? '#F78500' : '#EE3610';
    }
    return value < 140 ? '#23AF51' : value < 200 ? '#F78500' : '#EE3610';
  };

  const handleBloodSugar = (isAfter: boolean) => {
    if (!bloodSugar) return null;
    const [fasted, afterMeals] = bloodSugar;
    if ((isAfter && afterMeals === 0) || (!isAfter && fasted === 0))
      return null;
    const color = isAfter
      ? getBloodSugarColor(afterMeals, false)
      : getBloodSugarColor(fasted, true);
    return (
      <ColorText color={color} {...(isAfter ? { afterMeals } : { fasted })} />
    );
  };

  // 온도에 따른 글씨색 변화
  const handleTemperature = () => {
    if (!temp) return <ColorText color='#000000' />;
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
    return <ColorText temp={temp} color={color} />;
  };

  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return (
          <UnitContainer>
            <PillCheck>
              {pillName?.map((pill, index) => (
                <PillRow key={index}>
                  <div>{pill}</div>
                  <PillTimeContainer>
                    {time &&
                      time[index] &&
                      isPillTaken &&
                      handleIsTakenPill(time[index], isPillTaken[index])}
                  </PillTimeContainer>
                </PillRow>
              ))}
            </PillCheck>
          </UnitContainer>
        );
      case '혈당':
        return (
          <UnitContainer>
            <div>
              {handleBloodSugar(false)}
              {handleBloodSugar(true)}
            </div>
          </UnitContainer>
        );
      case '체온':
        return (
          <UnitContainer>
            {handleTemperature()}
            <Unit>&nbsp;°C</Unit>
          </UnitContainer>
        );
      case '체중':
        return (
          <UnitContainer>
            <Text style={{ fontWeight: '600' }}>{weight}</Text>
            <Unit>&nbsp;kg</Unit>
          </UnitContainer>
        );
      case '사진 기록':
        return <UnitContainer></UnitContainer>;
      default:
        return null;
    }
  };

  const isRender =
    (time && time.length > 0) ||
    (bloodSugar && bloodSugar.some((value) => value !== 0)) ||
    (temp && temp !== 0) ||
    (weight && weight !== 0) ||
    photo;

  return isRender ? (
    <Container isPill={title === '약 복용 여부'}>
      <ContentTitle>{title}</ContentTitle>
      {handleContent()}
    </Container>
  ) : null;
};

const Container = styled.div<{ isPill?: boolean }>`
  border: 0.5px #d9d9d9 solid;
  border-radius: 10px;
  padding: 13px 10px;
  margin: 15px 0;
  display: ${({ isPill }) => (isPill ? 'block' : 'flex')};
  justify-content: ${({ isPill }) => (isPill ? 'normal' : 'space-between')};
`;

const ContentTitle = styled.div`
  font-size: 14pt;
`;

const UnitContainer = styled.div`
  display: flex;
`;

const Text = styled.div`
  font-size: 15pt;
`;

const Blood = styled.div`
  font-size: 15pt;
  width: 40px;
  text-align: center;
`;

const TextContainer = styled.div`
  display: flex;
`;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;

const StyledLabel = styled.label`
  display: flex;
`;

const StyledInput = styled.input`
  appearance: none;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #72bf44;
  }

  &:not(:checked) {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #d9d9d9;
  }
`;

const Time = styled.div`
  display: flex;
  align-items: center;
`;

const PillCheck = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PillRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
`;

const PillTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 10px;
`;

export default DetailTextBox;
