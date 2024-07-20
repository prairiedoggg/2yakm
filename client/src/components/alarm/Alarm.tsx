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
import { useState } from 'react';
import Header from '../Header';
import Nav from '../Nav';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';

enum PageState {
  Main,
  AlarmSettings
}

const Alarm = () => {
  const [currentState, setCurrentState] = useState<PageState>(PageState.Main);

  const renderContent = () => {
    switch (currentState) {
      case PageState.AlarmSettings:
        return <AlarmSettings />;
      default:
        return (
          <AlarmPage
            onAddAlarm={() => setCurrentState(PageState.AlarmSettings)}
          />
        );
    }
  };

  return (
    <PageContainer>
      <Header />
      {renderContent()}
      <Nav />
    </PageContainer>
  );
};

export default Alarm;

const PageContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;
