/**
File Name : EditDetailTextBox
Description : 캘린더 하단 세부 내용 텍스트 박스 편집
Author : 임지영

History
Date        Author   Status    Description
2024.07.21  임지영   Created
2024.07.22  임지영   Modified   대략 틀 정리
*/

import { useState } from 'react';
import styled from 'styled-components';
import EditDetailPhoto from './EditDetailPhoto';

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
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Text = styled.div`
  font-size: 15pt;
`;
const TextInput = styled.input`
  width: 50px;
  font-size: 15pt;
  border: #d9d9d9 solid;
  border-radius: 8px;
  text-align: center;
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
  cursor: pointer;

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

interface EditDetailTextBoxProps {
  title: string;
  time?: string[][];
  pillName?: string[];
  isPillTaken?: boolean[][];
  bloodSugar?: number[];
  temp?: number;
  weight?: number;
  photo?: boolean;
}

const EditDetailTextBox = ({
  title,
  pillName,
  time,
  isPillTaken,
  bloodSugar,
  temp,
  weight,
  photo
}: EditDetailTextBoxProps) => {
  // 약 복용 여부
  const handleIsTakenPill = (times: string[], takenStatuses: boolean[]) => {
    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput type='checkbox' checked={takenStatuses[index]} />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  // 입력값
  const [preWeight, setWeight] = useState<number | undefined>(weight);
  const [preTemp, setTemp] = useState<number | undefined>(temp);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeight(value ? parseFloat(value) : undefined);
    setTemp(value ? parseFloat(value) : undefined);
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
            <TextContainer>
              <div style={{ display: 'flex', marginBottom: '10px' }}>
                <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
                  공복 혈당:&nbsp;
                </Text>
                <TextInput onChange={onChangeInput}></TextInput>
                <Unit>&nbsp;mg/dL</Unit>
              </div>
              <div style={{ display: 'flex' }}>
                <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
                  식후 혈당:&nbsp;
                </Text>
                <TextInput onChange={onChangeInput}></TextInput>
                <Unit>&nbsp;mg/dL</Unit>
              </div>
            </TextContainer>
          </UnitContainer>
        );
      case '체온':
        return (
          <UnitContainer>
            <TextInput value={preTemp} onChange={onChangeInput}></TextInput>
            <Unit>&nbsp;°C</Unit>
          </UnitContainer>
        );
      case '체중':
        return (
          <UnitContainer>
            <TextInput value={preWeight} onChange={onChangeInput}></TextInput>
            <Unit>&nbsp;kg</Unit>
          </UnitContainer>
        );
      case '사진 기록':
        return (
          <UnitContainer>
            <EditDetailPhoto />
          </UnitContainer>
        );
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

export default EditDetailTextBox;
