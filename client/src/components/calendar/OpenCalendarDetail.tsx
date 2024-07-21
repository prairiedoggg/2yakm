/**
File Name : OpenCalendarDetail
Description : 캘린더 하단 세부 내용 보기
Author : 임지영

History
Date        Author   Status    Description
2024.07.21  임지영   Created
*/

import styled from 'styled-components';
import DetailTextBox from './DetailTextBox';

const ContentContainer = styled.div``;

const OpenCalendarDetail: React.FC = () => {
  // // 사용자 캘린더 데이터 받아오기
  // const {data, isloading, error} = useQuery('calendar', () => fetch(url))
  return (
    <ContentContainer>
      {/* title을 배열로 관리 -> map */}
      <DetailTextBox
        title='약 복용 여부'
        pillName={['타이레놀', '처방약']}
        time={[['11시', '15시', '19시'], ['20시']]}
        isPillTaken={[[true, false, true], [true]]}
      />
      {/* 혈당 null 값은 0으로 바꾸기*/}
      <DetailTextBox title='혈당' bloodSugar={[100, 200]} />
      <DetailTextBox title='체온' temp={36.5} />
      <DetailTextBox title='체중' weight={10} />
      <DetailTextBox title='사진 기록' photo={true} />
    </ContentContainer>
  );
};

export default OpenCalendarDetail;
