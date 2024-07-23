import styled from 'styled-components';
import DetailTextBox from './DetailTextBox';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

const OpenCalendarDetail: React.FC = () => {
  // const {
  //   pillName,
  //   time,
  //   isPillTaken,
  //   bloodSugar,
  //   temp,
  //   weight,
  //   photo,
  //   setPillName,
  //   setTime,
  //   setIsPillTaken,
  //   setBloodSugar,
  //   setTemp,
  //   setWeight,
  //   setPhoto
  // } = useCalendar();

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['calendar'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/calendars');
      const data = await response.json();
      return data;
    }
  });

  console.log(data);
  if (isLoading) return <div>로딩중</div>;
  if (error) return <div>에러</div>;

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

const ContentContainer = styled.div``;

export default OpenCalendarDetail;
