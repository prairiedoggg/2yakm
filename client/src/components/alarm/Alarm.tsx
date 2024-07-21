/**
 * File Name : Alarm
 * Description : 알람 페이지
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.21  민선옥    Created
 */

import styled from 'styled-components';
import Nav from '../Nav';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';
import { useAlarmStore } from '../../store/alarm';

const Alarm = () => {
  const { currentPage } = useAlarmStore();

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
