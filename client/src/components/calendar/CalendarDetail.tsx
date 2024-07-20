/**
File Name : CalendarDetail
Description : 캘린더 하단 세부 내용
Author : 임지영

History
Date        Author   Status    Description
2024.07.17  임지영   Created
2024.07.18  임지영   Modified   내용 추가
2024.07.21  임지영   Modified    코치님 코드 리뷰 수정 (dayjs)
*/

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useDateStore } from '../../store/store';
import DetailTextBox from './DetailTextBox';

const CalandarDatailContainer = styled.div`
  background-color: #ffffff;
  padding: 5px 25px;
  padding-bottom: 80px;
`;
const ImgContainer = styled.div`
  text-align: center;
`;
const Arrow = styled.img`
  width: 20px;
  height: auto;
  cursor: pointer;
`;

const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DateBox = styled.div`
  font-weight: 500;
  font-size: 14pt;
`;

const Edit = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  padding: 20px 0;
`;

const CalendarDetail: React.FC = () => {
  // // 사용자 캘린더 데이터 받아오기
  // const {data, isloading, error} = useQuery('calendar', () => fetch(url))

  const { value } = useDateStore();

  dayjs.locale('ko');
  const days = dayjs(value).format('D. ddd');

  return (
    <CalandarDatailContainer>
      <ImgContainer>
        <Arrow src='/img/calendarArrow.png' alt='Arrow Icon' />
      </ImgContainer>
      <DateContainer>
        <DateBox>{days}</DateBox>
        <Edit src='/img/calendarEdit.png' alt='Edit Button' />
      </DateContainer>
      <ContentContainer>
        {/* title을 배열로 관리 -> map */}
        <DetailTextBox
          title='약 복용 여부'
          pillName={['타이레놀']}
          time={'11시'}
          isPillTaken={true}
        />
        {/* 혈당 null 값은 0으로 바꾸기*/}
        <DetailTextBox title='혈당' bloodSugar={[100, 200]} />
        <DetailTextBox title='체온' temp={36.5} />
        <DetailTextBox title='체중' weight={10} />
        <DetailTextBox title='사진 기록' photo={true} />
      </ContentContainer>
    </CalandarDatailContainer>
  );
};

export default CalendarDetail;
