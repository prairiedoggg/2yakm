/**
File Name : EditCalendarDetail
Description : 캘린더 하단 세부 내용 편집 
Author : 임지영

History
Date        Author   Status    Description
2024.07.19  임지영   Created
*/

import styled from 'styled-components';
import EditDetailTextBox from './EditDetailTextBox';

const ContentContainer = styled.div``;

const OpenCalendarDetail: React.FC = () => {
  // // 사용자 캘린더 데이터 받아오기
  // const {data, isloading, error} = useQuery('calendar', () => fetch(url))
  return (
    <ContentContainer>
      {/* title을 배열로 관리 -> map */}
      <EditDetailTextBox
        title='약 복용 여부'
        pillName={['타이레놀', '처방약']}
        time={[['11시', '15시', '19시'], ['20시']]}
        isPillTaken={[[true, false, true], [true]]}
      />
      {/* 혈당 null 값은 0으로 바꾸기*/}
      <EditDetailTextBox title='혈당' bloodSugar={[100, 200]} />
      <EditDetailTextBox title='체온' temp={36.5} />
      <EditDetailTextBox title='체중' weight={10} />
      <EditDetailTextBox title='사진 기록' photo={true} />
    </ContentContainer>
  );
};

export default OpenCalendarDetail;
