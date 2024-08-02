import { useState } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../store/calendar';
import { convertToArray } from './calendarDetails/IsPillTaken';

const EditIsTaken: React.FC = () => {
  const { calendarData, setPillData } = useCalendar();
  const [pillData, setPillDataState] = useState(calendarData?.pillData || []);
  const [showButtons, setShowButtons] = useState(
    Array(pillData.length).fill(false)
  );

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

  const handleTouchStart = (e, index: number) => {
    e.preventDefault();
    const touchStartX = e.touches[0].clientX;
    e.target.setAttribute('data-touch-start-x', touchStartX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e, index: number) => {
    const touchStartX = parseFloat(e.target.getAttribute('data-touch-start-x'));
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      const updatedShowButtons = showButtons.map((show, i) =>
        i === index ? true : show
      );
      setShowButtons(updatedShowButtons);
    }
  };

  const handleEdit = (index: number) => {};

  const handleDelete = (index: number) => {};

  return (
    <EditTakenContainer>
      {pillData.map((pill, index) => (
        <PillRow
          key={index}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={handleTouchMove}
          onTouchEnd={(e) => handleTouchEnd(e, index)}
        >
          <div>{pill.name}</div>
          <PillTimeContainer>
            {pill.time && pill.taken ? (
              handleIsTakenPill(pill, index)
            ) : (
              <div>시간 데이터 없음</div>
            )}
          </PillTimeContainer>
          {showButtons[index] && (
            <ButtonContainer>
              <Button onClick={() => handleEdit(index)}>편집</Button>
              <Button onClick={() => handleDelete(index)}>삭제</Button>
            </ButtonContainer>
          )}
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
  position: relative;
`;

const PillTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  right: 10px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
