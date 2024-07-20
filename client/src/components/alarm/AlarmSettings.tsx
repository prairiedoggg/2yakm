/**
 * File Name : AlarmSettings
 * Description : 알람설정
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.21  민선옥    Created
 */

import styled from 'styled-components';
import Nav from '../Nav';

const AlarmSettingsContainer = styled.div`
  
`

const AlarmName = styled.div`
  
`

const AlarmSettings: React.FC = () => {
  return (
    <AlarmSettingsContainer>
      <h2>알람 설정</h2>
      <AlarmName>
        <h3>알람이름</h3>
        
      </AlarmName>
      <Nav />
    </AlarmSettingsContainer>
  );
};

export default AlarmSettings;
