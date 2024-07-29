import styled from 'styled-components';
import EditDetailTextBox from './EditDetailTextBox';

const ContentContainer = styled.div``;

const OpenCalendarDetail: React.FC = () => {
  return (
    <ContentContainer>
      <EditDetailTextBox title='약 복용 여부' />
      <EditDetailTextBox title='혈당' />
      <EditDetailTextBox title='체온' />
      <EditDetailTextBox title='체중' />
      <EditDetailTextBox title='사진 기록' />
    </ContentContainer>
  );
};

export default OpenCalendarDetail;
