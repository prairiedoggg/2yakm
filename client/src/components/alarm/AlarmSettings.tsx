import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Select, Button, Input } from 'antd';
import { Icon } from '@iconify-icon/react';
import { useAlarmStore, Alarm } from '../../store/alarm';
import { createAlarm, updateAlarm } from '../../api/alarm';

const { Option } = Select;

const AlarmSettings = () => {
  const setCurrentPage = useAlarmStore((state) => state.setCurrentPage);
  const currentAlarm = useAlarmStore((state) => state.currentAlarm);
  const queryClient = useQueryClient();

  const [alarmName, setAlarmName] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('하루 3번');
  const [alarmTimes, setAlarmTimes] = useState<string[]>([
    '오전 9:00',
    '오후 1:00',
    '오후 8:00'
  ]);
  const [duration, setDuration] = useState<number>(3);

  useEffect(() => {
    if (currentAlarm) {
      setAlarmName(currentAlarm.name);
      setFrequency(currentAlarm.frequency);
      setAlarmTimes(currentAlarm.times);
      setDuration(currentAlarm.duration);
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
// 알람 기간 변경
    const handleDurationChange = (value: number) => {
      setDuration(value);
    };

  // 알람 생성
  const createMutation = useMutation(createAlarm, {
    onSuccess: () => {
      queryClient.invalidateQueries('alarms');
    }
  });

  // 알람 업데이트
  const updateMutation = useMutation(updateAlarm, {
    onSuccess: () => {
      queryClient.invalidateQueries('alarms');
    }
  });

  // 알람 저장후 메인 알람 페이지로 이동
  const handleSave = () => {
    const startDate = new Date().toISOString();
    const endDate = new Date(
      Date.now() + duration * 24 * 60 * 60 * 1000
    ).toISOString();

    const alarmData: Alarm = {
      id: currentAlarm?.id,
      name: alarmName,
      frequency,
      times: alarmTimes,
      startDate,
      endDate,
      interval: 0,
      message: '',
      time: '',
      alarmStatus: true,
      duration
    };

    if (currentAlarm) {
      updateMutation.mutate({ ...currentAlarm, ...alarmData });
    } else {
      createMutation.mutate(alarmData);
    }
    setCurrentPage('main');
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
          <AlarmDuration>
            <h4>얼마동안 약을 드셔야 하나요?</h4>
            <Select
              defaultValue='3일'
              style={{ width: 150 }}
              onChange={(value) => handleDurationChange(Number(value))}
            >
              <Option value='3일'>3일</Option>
              <Option value='5일'>5일</Option>
              <Option value='무제한'>내가 알람을 끌때까지</Option>
            </Select>
          </AlarmDuration>
          <AlarmFrequency>
            <h4>하루에 몇 번 드셔야 하나요</h4>
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

const AlarmDuration = styled.section``;

const AlarmFrequency = styled.section``;

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
