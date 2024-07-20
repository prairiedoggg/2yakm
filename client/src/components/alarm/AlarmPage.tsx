/**
 * File Name : AlarmPage
 * Description : 알람설정
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.20  민선옥    Created
 */

import styled from 'styled-components';

interface AlarmPageProps {
  onAddAlarm: () => void;
}

const AlarmPage = ({ onAddAlarm }:AlarmPageProps) => {
  return (
    <AlarmContainer>
      <AddAlarm src={`/img/plus.svg`} alt='알람추가' onClick={onAddAlarm} />
    </AlarmContainer>
  );
};

export default AlarmPage;

const AlarmContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const AddAlarm = styled.img`
  cursor: pointer;
`;
