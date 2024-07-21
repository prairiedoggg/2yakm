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
import { useDateStore } from '../../store/store';
import OpenCalendarDetail from './OpenCalendarDetail';
import EditCalendarDatail from './EditCalendarDetail';

const CalandarDatailContainer = styled.div`
  background-color: #ffffff;
  padding: 5px 25px;
  overflow-y: auto;
`;

const CalendarDetail: React.FC = () => {
  const { edit } = useDateStore();

  return (
    <CalandarDatailContainer>
      {edit ? <EditCalendarDatail /> : <OpenCalendarDetail />}
    </CalandarDatailContainer>
  );
};

export default CalendarDetail;
