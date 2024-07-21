/**
 * File Name : AlarmSettings
 * Description : 알람설정
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.21  민선옥    Created
 */

import { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import { Select, Button, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAlarmStore } from '../../store/alarm';

const { Option } = Select;

const AlarmSettings = () => {
  const addAlarm = useAlarmStore((state) => state.addAlarm);
  const updateAlarm = useAlarmStore((state) => state.updateAlarm);
  const setCurrentPage = useAlarmStore((state) => state.setCurrentPage);
  const currentAlarm = useAlarmStore((state) => state.currentAlarm); 
    const alarms = useAlarmStore((state) => state.alarms); 

  const [alarmName, setAlarmName] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('하루 3번');
  const [alarmTimes, setAlarmTimes] = useState<string[]>([
    '오전 9:00',
    '오후 1:00',
    '오후 8:00'
  ]);

  // 초기 상태 설정
  useEffect(() => {
    if (currentAlarm) {
      setAlarmName(currentAlarm.name);
      setFrequency(currentAlarm.frequency);
      setAlarmTimes(currentAlarm.times);
    }
  }, [currentAlarm]);

  // 빈도 변경
  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };

  // 알람 시간 추가
  const handleAddTime = () => {
    setAlarmTimes([...alarmTimes, '']);
  };

  // 특정 알람 시간 제거
  const handleRemoveTime = (index: number) => {
    const newAlarmTimes = alarmTimes.filter((_, i) => i !== index);
    setAlarmTimes(newAlarmTimes);
  };

  // 특정 알람 시간 변경
  const handleTimeChange = (value: string, index: number) => {
    const newAlarmTimes = [...alarmTimes];
    newAlarmTimes[index] = value;
    setAlarmTimes(newAlarmTimes);
  };

  // 알람 저장후 메인 알람 페이지로 이동
  const handleSave = () => {
    if (currentAlarm) {
       const alarmIndex = alarms.findIndex(
         (alarm) =>
           alarm.name === currentAlarm.name &&
           alarm.frequency === currentAlarm.frequency &&
           alarm.times.join(',') === currentAlarm.times.join(',')
       );
      updateAlarm(alarmIndex, {
        name: alarmName,
        frequency,
        times: alarmTimes
      });
    } else {
      addAlarm({ name: alarmName, frequency, times: alarmTimes });
    }
    setCurrentPage('main');
  };

  return (
    <>
      <AlarmSettingsContainer>
        <h2>알람 설정</h2>
        <SettingList>
          <AlarmName>
            <h4>알람이름</h4>
            <Input
              placeholder='약이름'
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
            />
          </AlarmName>
          <AlarmFrequency>
            <h4>빈도</h4>
            <Select
              defaultValue='하루 3번'
              style={{ width: 150 }}
              onChange={handleFrequencyChange}
            >
              <Option value='하루 3번'>하루 3번</Option>
              <Option value='하루 2번'>하루 2번</Option>
              <Option value='하루 1번'>하루 1번</Option>
            </Select>
          </AlarmFrequency>
          <AlarmTime>
            <h4>알람 시간</h4>
            {alarmTimes.map((time, index) => (
              <div key={index}>
                <Button
                  icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                  onClick={() => handleRemoveTime(index)}
                />
                <Input
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value, index)}
                  placeholder='시간 입력'
                  style={{ width: '100px', margin: '0 10px' }}
                />
              </div>
            ))}
            <Button
              type='dashed'
              onClick={handleAddTime}
              icon={<PlusCircleOutlined style={{ color: 'green' }} />}
              style={{ marginTop: '10px' }}
            >
              시간 추가
            </Button>
          </AlarmTime>
        </SettingList>
      </AlarmSettingsContainer>
      <ButtonContainer>
        <RunButton onClick={() => setCurrentPage('main')}>취소</RunButton>
        <RunButton onClick={handleSave}>저장</RunButton>
      </ButtonContainer>
    </>
  );
};

export default AlarmSettings;

const AlarmSettingsContainer = styled.div`
  margin: auto;
  padding: 20px 0;
  width: 80vw;

  & h2 {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
`;

const SettingList = styled.div`
  padding-top: 40px;

  & section {
    padding: 15px 0;
  }

  & h4 {
    margin-bottom: 10px;
    font-weight: 400;
  }
`;

const AlarmName = styled.section``;

const AlarmFrequency = styled.section``;

const AlarmTime = styled.section`
  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 100px;
  height: 60px;
  background-color: var(--main-color);
`;

const RunButton = styled.button`
  flex: 1;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  border: none;
  background-color: transparent;
`;
