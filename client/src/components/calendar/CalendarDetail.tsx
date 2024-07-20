/**
File Name : CalendarDetail
Description : 캘린더 하단 세부 내용
Author : 임지영

History
Date        Author   Status    Description
2024.07.17  임지영   Created
2024.07.18  임지영   Modified   내용 추가
*/

import styled from 'styled-components';
import moment from 'moment';
import 'moment/locale/ko';
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
const Arrow = styled.img.attrs({
  src: `/img/calendarArrow.png`,
  alt: 'Arrow Icon'
})`
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

const Edit = styled.img.attrs({
  src: '/img/calendarEdit.png',
  alt: 'Edit Button'
})`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  padding: 20px 0;
`;

const days: string[] = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarDetail: React.FC = () => {
  // // 사용자 캘린더 데이터 받아오기
  // const {data, isloading, error} = useQuery('calendar', () => fetch(url))

  const { value } = useDateStore();

  moment.locale('ko');
  const date = `${moment(value).format('DD')}. ${days[moment(value).day()]}`;

  return (
    <CalandarDatailContainer>
      <ImgContainer>
        <Arrow />
      </ImgContainer>
      <DateContainer>
        <DateBox className='text-gray-500 mt-4'>{date}</DateBox>
        <Edit />
      </DateContainer>
      <ContentContainer>
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
