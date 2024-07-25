import { useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';
import { useAlarmStore } from '../../store/alarm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <PageContainer>
        {renderContent()}
        <Nav />
      </PageContainer>
    </QueryClientProvider>
  );
};

export default Alarm;

const PageContainer = styled.div`
  width: 100%;
`;
