import { useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';
import { useAlarmStore } from '../../store/alarm';

const Alarm = () => {
  const { currentPage, setCurrentPage } = useAlarmStore();

  useEffect(() => {
    setCurrentPage('main');
  }, [setCurrentPage]);

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
