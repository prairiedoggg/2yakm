import styled from 'styled-components';

const NotSearched = () => {
  return (
    <>
      <NotSearchedContainer>
        <Image src='/img/notSearched.png' />
        <Text className='main'>검색 결과가 없어요</Text>
        <Text className='sub'>
          철자를 확인하거나
          <br /> 다른 키워드로 검색해보세요.
        </Text>
      </NotSearchedContainer>
    </>
  );
};

export default NotSearched;

const NotSearchedContainer = styled.div`
  padding: 30% 20%;
  text-align: center;
`;

const Image = styled.img`
  width: 65%;
  padding-left: 15%;
`;

const Text = styled.div`
  color: #6f6f6f;

  &.main {
    margin-top: 30px;
    font-size: 18pt;
  }
  &.sub {
    font-size: 10pt;
    margin-top: 20px;
    margin-bottom: 25%;
  }
`;
