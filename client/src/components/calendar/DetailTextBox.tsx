/**
File Name : DetailTextBox
Description : 캘린더 하단 세부 내용 텍스트 박스
Author : 임지영

History
Date        Author   Status    Description
2024.07.19  임지영   Created
2024.07.20  임지영   Modified    스타일 조정
*/

import styled, { css } from 'styled-components';

const Container = styled.div<{ isPill?: boolean }>`
  border: 0.5px #d9d9d9 solid;
  border-radius: 10px;
  padding: 13px 10px;
  margin: 15px 0;

  ${({ isPill }) =>
    isPill
      ? css`
          display: block;
        `
      : css`
          display: flex;
          justify-content: space-between;
        `}
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
const PillCheck = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

interface ColorText {
  temp?: number;
  fasted?: number;
  afterMeals?: number;
  color: string;
}

// 색상 변화
const ColorText: React.FC<ColorText> = ({
  color,
  temp,
  fasted,
  afterMeals
}) => {
  return (
    <TextContainer>
      {fasted !== undefined && (
        <Text style={{ fontSize: '14pt' }}>공복 혈당:&nbsp;</Text>
      )}
      {afterMeals !== undefined && (
        <Text style={{ fontSize: '14pt' }}>식후 혈당:&nbsp;</Text>
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

interface DetailTextBox {
  title: string;
  time?: string;
  pillName?: string[];
  isPillTaken?: boolean;
  bloodSugar?: number[];
  temp?: number;
  weight?: number;
  photo?: boolean;
}

const DetailTextBox: React.FC<DetailTextBox> = ({
  title,
  pillName,
  time,
  isPillTaken,
  bloodSugar,
  temp,
  weight,
  photo
}) => {
  // 약 복용 여부
  // const handleIsTakenPill = () => (

  // )
  // 혈당에 따른 글자색 변화
  const handleBloodSugar = (isAfter: boolean) => {
    if (bloodSugar !== undefined) {
      const [fasted, afterMeals] = bloodSugar;

      if (isAfter && afterMeals === 0) return null;
      if (!isAfter && fasted === 0) return null;

      const getColor = (value: number, isFasted: boolean) => {
        if (isFasted) {
          if (value < 100) return '#23AF51';
          if (value >= 100 && value < 126) return '#F78500';
          if (value >= 126) return '#EE3610';
        } else {
          if (value < 140) return '#23AF51';
          if (value >= 140 && value < 200) return '#F78500';
          if (value >= 200) return '#EE3610';
        }
        return '#000000';
      };

      const fastedColor = getColor(fasted, true);
      const afterMealsColor = getColor(afterMeals, false);

      if (isAfter) {
        return <ColorText color={afterMealsColor} afterMeals={afterMeals} />;
      } else {
        return <ColorText color={fastedColor} fasted={fasted} />;
      }
    }
    return null;
  };

  // 온도에 따른 글씨색 변화
  const handleTemperature = () => {
    if (temp !== undefined) {
      if (temp >= 35.8 && temp < 37.2) {
        return <ColorText temp={temp} color='#72BF44' />;
      } else if (temp >= 37.2 && temp < 38) {
        return <ColorText temp={temp} color='#D8C100' />;
      } else if (temp >= 38 && temp < 39) {
        return <ColorText temp={temp} color='#F69999' />;
      } else if (temp >= 39) {
        return <ColorText temp={temp} color='#C20000' />;
      } else {
        return <ColorText temp={temp} color='#000000' />;
      }
    }
    return <ColorText color='#000000' />;
  };

  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return (
          <UnitContainer>
            <PillCheck>
              <div>{pillName}</div>
              <div>
                <div className='relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700'>
                  <span className=''>chip outlined</span>
                </div>
              </div>
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
        return <UnitContainer>{/* <DetailPhoto /> */}</UnitContainer>;
      default:
        return null;
    }
  };

  const isRender =
    time !== undefined ||
    (bloodSugar !== undefined && bloodSugar.some((value) => value !== 0)) ||
    (temp !== 0 && temp !== undefined) ||
    (weight !== undefined && weight !== 0) ||
    photo === true;

  return isRender ? (
    <Container isPill={title === '약 복용 여부'}>
      <ContentTitle>{title}</ContentTitle>
      {handleContent()}
    </Container>
  ) : null;
};

export default DetailTextBox;
