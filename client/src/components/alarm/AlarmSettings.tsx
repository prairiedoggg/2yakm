import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, DatePicker } from 'antd';
import { Icon } from '@iconify-icon/react';
import { useAlarmStore, Alarm } from '../../store/alarm';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

const AlarmSettings = () => {
  const setCurrentPage = useAlarmStore((state) => state.setCurrentPage);
  const currentAlarm = useAlarmStore((state) => state.currentAlarm);

  const [alarmName, setAlarmName] = useState<string>('');
  const [alarmTimes, setAlarmTimes] = useState<string[]>([
    '오전 9:00',
    '오후 1:00',
    '오후 8:00'
  ]);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(3, 'days'));

  useEffect(() => {
    if (currentAlarm) {
      setAlarmName(currentAlarm.name);
      setAlarmTimes(currentAlarm.times);
      setStartDate(dayjs(currentAlarm.startDate));
      setEndDate(dayjs(currentAlarm.endDate));
    }
  }, [currentAlarm]);

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
    const alarmData: Alarm = {
      id: currentAlarm?.id,
      name: alarmName,
      times: alarmTimes,
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
      alarmStatus: true
    };

    if (currentAlarm) {
      axios
        .put(
          `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/alarms/${
            currentAlarm.id
          }`,
          alarmData,
          {
            withCredentials: true
          }
        )
        .then(() => setCurrentPage('main'))
        .catch((error) => console.error('에러:', error));
    } else {
      axios
        .post(
          `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/alarms`,
          alarmData,
          {
            withCredentials: true
          }
        )
        .then(() => setCurrentPage('main'))
        .catch((error) => console.error('에러:', error));
    }
  };

  return (
    <>
      <AlarmSettingsContainer>
        <h2>알람 설정</h2>
        <SettingList>
          <AlarmName>
            <h4>어떤 약을 드시고 계신가요?</h4>
            <Input
              placeholder='알르레기 약'
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
            />
          </AlarmName>
          <AlarmStartDate>
            <h4>언제부터 약을 드시나요?</h4>
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </AlarmStartDate>
          <AlarmEndDate>
            <h4>언제까지 약을 드시나요?</h4>
            <DatePicker value={endDate} onChange={(date) => setEndDate(date)} />
          </AlarmEndDate>
          <AlarmTime>
            <h4>알람 시간</h4>
            {alarmTimes.map((time, index) => (
              <div key={index}>
                <Button
                  icon={
                    <Icon icon='mdi:minus-circle' style={{ color: 'red' }} />
                  } // 변경된 부분
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
              icon={<Icon icon='mdi:plus-circle' style={{ color: 'green' }} />} // 변경된 부분
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

const AlarmStartDate = styled.section``;

const AlarmEndDate = styled.section``;

const AlarmTime = styled.section`
  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
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
