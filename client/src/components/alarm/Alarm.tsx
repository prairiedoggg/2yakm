import { useEffect } from 'react';
import styled from 'styled-components';
import { useAlarmStore } from '../../store/alarm';
import Nav from '../Nav';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';

const Alarm = () => {
  const { currentPage, setCurrentPage } = useAlarmStore();

  useEffect(() => {
    return () => setCurrentPage('main');
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'settings':
        return <AlarmSettings />;
      default:
        return <AlarmPage />;
    }
  };

  return (
    <PageContainer>
      {renderContent()}
      <Nav />
    </PageContainer>
  );
};

export default Alarm;

const PageContainer = styled.div`
  width: 100%;
`;
