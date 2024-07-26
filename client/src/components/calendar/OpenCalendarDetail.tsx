import styled from 'styled-components';
import DetailTextBox from './DetailTextBox';

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

  // console.log(data);
  // if (isLoading) return <div>로딩중</div>;
  // if (error) return <div>에러</div>;

  return (
    <ContentContainer>
      {/* title을 배열로 관리 -> map */}
      <DetailTextBox
        title='약 복용 여부'
        pillName={[]}
        time={[[]]}
        isPillTaken={[[]]}
      />
      {/* 혈당 null 값은 0으로 바꾸기*/}
      {/* bloodsugarBefore= '100' bloodsugarAfter = '200' */}
      <DetailTextBox title='혈당' bloodSugar={[]} />
      <DetailTextBox title='체온' temp={0} />
      <DetailTextBox title='체중' weight={0} />
      <DetailTextBox title='사진 기록' photo={false} />
    </ContentContainer>
  );
};

const ContentContainer = styled.div``;

export default OpenCalendarDetail;
