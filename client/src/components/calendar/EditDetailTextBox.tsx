/**
File Name : EditDetailTextBox
Description : 캘린더 하단 세부 내용 텍스트 박스 편집
Author : 임지영

History
Date        Author   Status    Description
2024.07.21  임지영   Created
2024.07.22  임지영   Modified   대략 틀 정리
2024.07.22  임지영   Modified   리팩토링
*/

import { useState } from 'react';
import styled from 'styled-components';
import EditDetailPhoto from './EditDetailPhoto';
import { FiXCircle } from 'react-icons/fi';

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
  background-size: 120% 120%;
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");

  &:checked {
    border-color: transparent;
    background-color: #72bf44;
  }

  &:not(:checked) {
    border-color: transparent;
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
  const handleIsTakenPill = (times: string[], takenStatuses: boolean[]) => {
    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput type='checkbox' checked={takenStatuses[index]} />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  // 삭제 버튼
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number | undefined>(
    weight || temp
  );
  const handleDelete = () => {
    setIsDeleted(true);
    setInputValue(undefined);
  };
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeleted(false);
    const value = e.target.value;
    setInputValue(value ? parseFloat(value) : undefined);
  };

  const renderSimpleInput = (
    label: string,
    value: number | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    unit: string
  ) => (
    <UnitContainer>
      <TextInput
        value={isDeleted ? '' : value}
        onChange={onChange}
        onFocus={() => setIsDeleted(false)}
      />
      <Unit>&nbsp;{unit}</Unit>
      <FiXCircle
        style={{ color: '#777777', margin: '5px 5px' }}
        onClick={handleDelete}
      />
    </UnitContainer>
  );

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
          <TextContainer>
            {renderSimpleInput(
              '공복 혈당',
              bloodSugar?.[0],
              onChangeInput,
              'mg/dL'
            )}
            {renderSimpleInput(
              '식후 혈당',
              bloodSugar?.[1],
              onChangeInput,
              'mg/dL'
            )}
          </TextContainer>
        );
      case '체온':
        return renderSimpleInput('체온', temp, onChangeInput, '°C');
      case '체중':
        return renderSimpleInput('체중', weight, onChangeInput, 'kg');
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

  const isPill = title === '약 복용 여부';

  return isRender ? (
    !isDeleted ? (
      <Container isPill={isPill}>
        <ContentTitle>{title}</ContentTitle>
        {handleContent()}
      </Container>
    ) : null
  ) : null;
};

export default EditDetailTextBox;
