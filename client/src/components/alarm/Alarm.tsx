/**
 * File Name : alarm
 * Description : 알람설정
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.20  민선옥    Created
 */

import styled from 'styled-components';
import Header from '../Header';
import Nav from '../Nav';

const AlarmContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const AddAlarm = styled.img`
`;

const Alarm: React.FC = () => {
  return (
    <>
      <Header></Header>
      <AlarmContainer>
        <AddAlarm src={`/img/plus.svg`} alt='알람추가' />
      </AlarmContainer>

      <Nav></Nav>
    </>
  );
};

export default Alarm;
