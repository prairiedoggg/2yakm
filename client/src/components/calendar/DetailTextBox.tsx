import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';
import Info from '../Info';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages';
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
  const { setEdit, setArrow } = useDateStore();
  const login = Cookies.get('login');
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  const handleInfoText = () => {
    switch (title) {
      case '혈당':
        return (
          <Info
            text={
              '정상 : <br /> 공복 혈당 100미만, 식후 혈당 140미만 <br /> <br />관리 필요: <br /> 공복혈당 100이상 126미만, 식후혈당 140이상 200미만<br/> <br />당뇨:  <br />공복혈당 126이상, 식후혈당 200이상 '
            }
            category='혈당'
          />
        );
      case '체온':
        return (
          <Info
            text={
              '정상: 35.8 ~ 37.2도  <br /> <br />미열: 37.2 ~ 37.9도 <br /> <br />중등도열: 38 ~ 38.9도  <br /> <br />고열: 39도 이상 '
            }
            category='체온'
          />
        );
      case '사진 기록':
        return (
          <Info
            text={
              '피부 염증처럼 상태를 기록하고 싶은 부분의 사진을 등록해보세요.<br /> 이후 병원 진료에 도움을 받을 수 있어요.'
            }
            category='사진 기록'
          />
        );
      default:
        return null;
    }
  };

  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return <IsPillTaken pillData={pillData} edit={false} />;
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
    if (login) {
      setEdit(true);
      setArrow(true);
    } else {
      setPopupType(PopupType.LoginRequired);
      setShowPopup(true);
    }
  };

  return isRender ? (
    <PillContainer isPill={isPill} onClick={() => setArrow(true)}>
      <ContentTitle>
        {title}
        {handleInfoText()}
      </ContentTitle>
      <UnitContainer>{handleContent()}</UnitContainer>
    </PillContainer>
  ) : isEmpty ? (
    <>
      <Empty onClick={() => openEdit()}>
        {title} 정보 없음. 추가하려면 탭 하세요.
      </Empty>
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </>
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
  display: flex;
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
