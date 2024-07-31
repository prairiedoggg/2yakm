import { FiXCircle } from 'react-icons/fi';
import styled from 'styled-components';
import { useCalendar } from '../../store/store';
import EditDetailPhoto from './EditDetailPhoto';
import { convertToArray } from './calendarDetails/IsPillTaken';

interface EditDetailTextBoxProps {
  title: string;
}

const EditDetailTextBox = ({ title }: EditDetailTextBoxProps) => {
  const {
    calendarData,
    setBloodSugarAfter,
    setBloodSugarBefore,
    setTemp,
    setWeight
  } = useCalendar();

  const handleIsTakenPill = (times: string[], takenStatuses: boolean[]) => {
    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput type='checkbox' checked={takenStatuses[index]} />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  const renderSimpleInput = (
    label: string,
    value: string | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    unit: string,
    handleDelete: (label: string) => void
  ) => (
    <UnitContainer>
      {(label === '공복 혈당' || label === '식후 혈당') && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          {label}: &nbsp;
        </Text>
      )}
      <TextInput value={value ?? ''} onChange={onChange} />
      <Unit>&nbsp;{unit}</Unit>
      <FiXCircle
        style={{ color: '#777777', margin: '5px 5px' }}
        onClick={() => handleDelete(label)}
      />
    </UnitContainer>
  );

  const handleContent = (title: string) => {
    switch (title) {
      case '약 복용 여부':
        return (
          <UnitContainer>
            <PillCheck>
              {calendarData?.pillData?.map((pill, index) => {
                const times = convertToArray(pill.time) as string[];
                const takenStatuses = convertToArray(pill.taken) as boolean[];

                return (
                  <PillRow key={index}>
                    <div>{pill.name}</div>
                    <PillTimeContainer>
                      {times.length && takenStatuses.length ? (
                        handleIsTakenPill(times, takenStatuses)
                      ) : (
                        <div>시간 데이터 없음</div>
                      )}
                    </PillTimeContainer>
                  </PillRow>
                );
              })}
            </PillCheck>
          </UnitContainer>
        );
      case '혈당':
        return (
          <TextContainer>
            {renderSimpleInput(
              '공복 혈당',
              calendarData?.bloodsugarbefore,
              (e) => setBloodSugarBefore(parseInt(e.target.value) || null),
              'mg/dL',
              handleDeleteField
            )}
            {renderSimpleInput(
              '식후 혈당',
              calendarData?.bloodsugarafter,
              (e) => setBloodSugarAfter(parseInt(e.target.value) || null),
              'mg/dL',
              handleDeleteField
            )}
          </TextContainer>
        );
      case '체온':
        return (
          <>
            {renderSimpleInput(
              '체온',
              calendarData?.temp,
              (e) => setTemp(parseFloat(e.target.value) || null),
              '°C',
              handleDeleteField
            )}
          </>
        );

      case '체중':
        return (
          <>
            {renderSimpleInput(
              '체중',
              calendarData?.weight,
              (e) => setWeight(parseFloat(e.target.value) || null),
              'kg',
              handleDeleteField
            )}
          </>
        );
      case '사진 기록':
        return (
          <UnitContainer className='photo'>
            <EditDetailPhoto />
          </UnitContainer>
        );
      default:
        return null;
    }
  };

  const handleDeleteField = (label: string) => {
    switch (label) {
      case '공복 혈당':
        setBloodSugarBefore(null);
        break;
      case '식후 혈당':
        setBloodSugarAfter(null);
        break;
      case '체온':
        setTemp(null);
        break;
      case '체중':
        setWeight(null);
        break;
      default:
        break;
    }
  };

  const isPill = title === '약 복용 여부';

  return (
    <Container isPill={isPill}>
      <ContentTitle>
        {title}
        {isPill && calendarData?.pillData ? (
          <StyledButton>수정하기</StyledButton>
        ) : isPill && !calendarData?.pillData ? (
          <StyledButton>추가하기</StyledButton>
        ) : null}
      </ContentTitle>
      {handleContent(title)}
    </Container>
  );
};

export default EditDetailTextBox;
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
  display: flex;
`;

const UnitContainer = styled.div`
  display: flex;

  &.photo {
    justify-content: space-between;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextInput = styled.input.attrs({
  type: 'number',
  step: 'any'
})`
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

const Text = styled.div`
  font-size: 15pt;
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

const StyledButton = styled.button`
  width: 70px;
  text-align: center;
  border-radius: 10px;
  border: none;
  background-color: #d9d9d9;
`;
