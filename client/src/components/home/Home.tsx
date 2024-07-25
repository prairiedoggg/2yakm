import styled from 'styled-components';
import MainHeader from './HomeHeader';
import CardNews from './CardNews';
import Footer from '../Footer';
import Nav from '../Nav';
import BottomEditNameSheet from '../authentication/BottomEditNameSheet';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const MainContainer = styled.div`
  width: 100vw;
`;

const Home: React.FC = () => {
  const location = useLocation();
  const [BottomSheet, setBottomSheet] = useState(
    location.state?.showBottomSheet
  );

  return (
    <MainContainer>
      <MainHeader />
      <CardNews />
      <BottomEditNameSheet
        isVisible={BottomSheet}
        onClose={() => setBottomSheet(false)}
      />
      <Nav />
      <Footer />
    </MainContainer>
  );
};

export default Home;