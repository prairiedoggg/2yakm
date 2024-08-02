import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';
import BloodSugar from './calendarDetails/BloodSugar';
import IsPillTaken from './calendarDetails/IsPillTaken';
import Photo from './calendarDetails/Photo';
import Temperature from './calendarDetails/Temperature';
import Weight from './calendarDetails/Weight';

interface DetailTextBoxProps {
  title: string;
  pillData?: {
    name?: string;
    time?: string[];
    taken?: boolean[];
  }[];
  bloodsugarbefore?: number;
  bloodsugarafter?: number;
  temp?: number;
  weight?: number;
  photo?: string;
}

const DetailTextBox = ({
  title,
  pillData,
  bloodsugarbefore,
  bloodsugarafter,
  temp,
  weight,
  photo
}: DetailTextBoxProps) => {
  const { setAddTaken, setEdit, setArrow } = useDateStore();

  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return <IsPillTaken pillData={pillData} />;
      case '혈당':
        return (
          <BloodSugar
            bloodsugarbefore={bloodsugarbefore}
            bloodsugarafter={bloodsugarafter}
          />
        );
      case '체온':
        return <Temperature temp={temp} />;
      case '체중':
        return <Weight weight={weight} />;
      case '사진 기록':
        return <Photo photo={photo} />;
      default:
        return null;
    }
  };

  const isRender =
    (pillData && pillData.length > 0) ||
    (bloodsugarbefore !== undefined && bloodsugarbefore !== 0) ||
    (bloodsugarafter !== undefined && bloodsugarafter !== 0) ||
    (temp !== undefined && temp !== 0) ||
    (weight !== undefined && weight !== 0) ||
    (photo !== undefined && photo !== null);

  const isEmpty =
    (!pillData || pillData.length === 0) &&
    (bloodsugarbefore === undefined || bloodsugarbefore === 0) &&
    (bloodsugarafter === undefined || bloodsugarafter === 0) &&
    (temp === undefined || temp === 0) &&
    (weight === undefined || weight === 0) &&
    (photo === undefined || photo === null);

  const isPill = title === '약 복용 여부';

  const openEdit = () => {
    setEdit(true);
    setArrow(true);
  };

  return isRender ? (
    <PillContainer isPill={isPill}>
      <ContentTitle>{title}</ContentTitle>
      <UnitContainer>{handleContent()}</UnitContainer>
    </PillContainer>
  ) : isEmpty ? (
    <Empty onClick={() => openEdit}>
      {title} 정보 없음. 추가하려면 탭 하세요.
    </Empty>
  ) : null;
};

const PillContainer = styled.div<{ isPill?: boolean }>`
  border: 0.5px #d9d9d9 solid;
  border-radius: 10px;
  padding: 13px 10px;
  margin: 15px 0;
  display: ${({ isPill }) => (isPill ? 'block' : 'flex')};
  justify-content: ${({ isPill }) => (isPill ? 'normal' : 'space-between')};
  cursor: pointer;
`;

const ContentTitle = styled.div`
  font-size: 14pt;
`;

const UnitContainer = styled.div`
  display: flex;
`;

const Empty = styled.div`
  border-radius: 10px;
  background-color: #ececec;
  border: #d9d9d9 solid 0.5px;
  height: 50px;
  padding-left: 10px;
  line-height: 50px;
  font-size: 10.5pt;
  margin-top: 10px;
  color: #9b9a9a;
  cursor: pointer;
`;

export default DetailTextBox;
