import { useState } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../store/calendar';
import { convertToArray } from './calendarDetails/IsPillTaken';

const EditIsTaken: React.FC = () => {
  const { calendarData, setPillData } = useCalendar();

  const [pillData, setPillDataState] = useState(calendarData?.pillData || []);

  const handleCheckboxChange = (index: number, timeIndex: number) => {
    const updatedPillData = pillData.map((pill, pillIndex) => {
      if (pillIndex === index) {
        const updatedTakenStatuses = (
          convertToArray(pill.taken) as boolean[]
        ).map((status, i) => (i === timeIndex ? !status : status));
        return { ...pill, taken: updatedTakenStatuses };
      }
      return pill;
    });

    setPillDataState(updatedPillData);
    setPillData(updatedPillData);
  };

  const handleIsTakenPill = (pill: any, pillIndex: number) => {
    const times = convertToArray(pill.time) as string[];
    const takenStatuses = convertToArray(pill.taken) as boolean[];

    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput
          type='checkbox'
          checked={takenStatuses[index]}
          onChange={() => handleCheckboxChange(pillIndex, index)}
        />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  return (
    <EditTakenContainer>
      {pillData.map((pill, index) => (
        <PillRow key={index}>
          <div>{pill.name}</div>
          <PillTimeContainer>
            {pill.time && pill.taken ? (
              handleIsTakenPill(pill, index)
            ) : (
              <div>시간 데이터 없음</div>
            )}
          </PillTimeContainer>
        </PillRow>
      ))}
    </EditTakenContainer>
  );
};

export default EditIsTaken;

const EditTakenContainer = styled.div``;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
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
    background-color: #72bf44;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
  }

  &:not(:checked) {
    border-color: transparent;
    background-color: #d9d9d9;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
  }
`;

const Time = styled.div`
  display: flex;
  align-items: center;
`;

const PillRow = styled.div`
  display: flex;
  align-items: center;

  justify-content: space-between;
  //   border-radius: 10px;
  //   border: 0.5px #b9b9b9 solid;
  //   padding: 10px 10px;
`;

const PillTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 10px;
`;
