import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import Header from '../Header';
import { Alarm, useAlarmStore } from '../../store/alarm';
import { getAlarms, deleteAlarm } from '../../api/alarmApi';

const AlarmPage = () => {
  const { alarms, setCurrentPage, setCurrentAlarm, setAlarms } =
    useAlarmStore();
  const [isToggled, setIsToggled] = useState<boolean[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const data = await getAlarms();
        setAlarms(data);
        setIsToggled(Array(data.length).fill(true));
      } catch (error) {
        console.error('알람을 불러오는 도중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlarms();
  }, [setAlarms]);

  useEffect(() => {
    console.log('알람 상태 업데이트:', alarms);
    if (alarms) {
      setIsToggled(Array(alarms.length).fill(true));
    }
  }, [alarms]);

  // 알람 온오프 토글기능
  const handleToggle = (index: number) => {
    const newToggledState = [...isToggled];
    newToggledState[index] = !newToggledState[index];
    setIsToggled(newToggledState);
  };

  // 삭제 버튼 토글기능
  const handleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  // 특정 알람 삭제
  const handleDelete = (index: number) => {
    const alarmToDelete = alarms[index];
    if (alarmToDelete && alarmToDelete.id) {
      deleteAlarm(alarmToDelete.id)
        .then(() => {
          setAlarms(alarms.filter((_, i) => i !== index));
          setIsToggled(isToggled.filter((_, i) => i !== index));
        })
        .catch((error) => console.error('에러:', error));
    }
  };

  // 알람 수정 모드로 전환
  const handleEditAlarm = (alarm: Alarm) => {
    setCurrentAlarm(alarm);
    setCurrentPage('settings');
  };

  if (isLoading) {
    return <p>잠시만 기다려주세요..!</p>;
  }

  return (
    <>
      <Header />
      <AlarmContainer>
        <IconContainer>
          <Icon icon='mdi:pencil' onClick={handleDeleteMode} />
        </IconContainer>
        <AlarmList>
          {alarms.map((alarm, index) => (
            <AlarmItemContainer key={index}>
              <AlarmItem onClick={() => handleEditAlarm(alarm)}>
                <AlarmHeader>
                  <AlarmName>{alarm.name}</AlarmName>
                  <ToggleSwitch onClick={(event) => event.stopPropagation()}>
                    <input
                      type='checkbox'
                      checked={isToggled[index]}
                      onChange={() => handleToggle(index)}
                    />
                    <Slider />
                  </ToggleSwitch>
                </AlarmHeader>
                <AlarmTimes>
                  {alarm.times.map((timeObj, i) => (
                    <AlarmTime key={i}>{timeObj.time}</AlarmTime>
                  ))}
                </AlarmTimes>
              </AlarmItem>
              {isDeleteMode && (
                <DeleteButton onClick={() => handleDelete(index)}>
                  삭제
                </DeleteButton>
              )}
            </AlarmItemContainer>
          ))}
        </AlarmList>
        <AddAlarm
          src={`/img/plus.svg`}
          alt='알람추가'
          onClick={() => setCurrentPage('settings')}
        />
      </AlarmContainer>
    </>
  );
};

export default AlarmPage;

const AlarmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85vw;
  margin: auto;
`;

const IconContainer = styled.div`
  margin-left: auto;
  margin-bottom: 20px;
  cursor: pointer;
`;

const AlarmList = styled.div`
  width: 100%;
`;

const AlarmItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AlarmItem = styled.div`
  flex: 1;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const AlarmHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const AlarmName = styled.h4`
  padding-left: 5px;
  font-weight: 500;
`;

const AlarmTimes = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AlarmTime = styled.span`
  background: #f0f0f0;
  border-radius: 5px;
  padding: 3px 6px;
  margin-right: 5px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  margin-right: 10px;
  width: 34px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + span {
    background-color: #4caf50;
  }

  input:checked + span:before {
    transform: translateX(14px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;

  &:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const DeleteButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const AddAlarm = styled.img`
  width: 60px;
  cursor: pointer;
  margin-top: 20px;
`;
