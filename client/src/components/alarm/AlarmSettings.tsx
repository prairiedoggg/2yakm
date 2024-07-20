/**
 * File Name : AlarmSettings
 * Description : 알람설정
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.21  민선옥    Created
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Button, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Nav from '../Nav';

const { Option } = Select;

const AlarmSettings: React.FC = () => {
  // 알람 빈도와 시간을 관리하는 상태 정의
  const [frequency, setFrequency] = useState<string>('하루 3번');
  const [alarmTimes, setAlarmTimes] = useState<string[]>([
    '오전 9:00',
    '오후 1:00',
    '오후 8:00'
  ]);

  // 빈도 선택이 변경될 때 호출되는 함수
  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };

  // 새로운 알람 시간을 추가하는 함수
  const handleAddTime = () => {
    setAlarmTimes([...alarmTimes, '']);
  };

  // 특정 알람 시간을 제거하는 함수
  const handleRemoveTime = (index: number) => {
    const newAlarmTimes = alarmTimes.filter((_, i) => i !== index);
    setAlarmTimes(newAlarmTimes);
  };

  // 특정 알람 시간을 변경하는 함수
  const handleTimeChange = (value: string, index: number) => {
    const newAlarmTimes = [...alarmTimes];
    newAlarmTimes[index] = value;
    setAlarmTimes(newAlarmTimes);
  };

  return (
    <AlarmSettingsContainer>
      <h2>알람 설정</h2>
      <AlarmName>
        <h3>알람이름</h3>
        <Input placeholder='약이름' />
      </AlarmName>
      <AlarmFrequency>
        <h3>빈도</h3>
        <Select
          defaultValue='하루 3번'
          style={{ width: 120 }}
          onChange={handleFrequencyChange}
        >
          <Option value='하루 3번'>하루 3번</Option>
          <Option value='하루 2번'>하루 2번</Option>
          <Option value='하루 1번'>하루 1번</Option>
        </Select>
      </AlarmFrequency>
      <AlarmTime>
        <h3>알람 시간</h3>
        {alarmTimes.map((time, index) => (
          <div key={index}>
            <Button
              icon={<MinusCircleOutlined />}
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
          icon={<PlusCircleOutlined />}
          style={{ marginTop: '10px' }}
        >
          시간 추가
        </Button>
      </AlarmTime>
      <Nav />
    </AlarmSettingsContainer>
  );
};

export default AlarmSettings;

// 스타일 컴포넌트 정의
const AlarmSettingsContainer = styled.div`
  padding: 20px;
`;

const AlarmName = styled.div`
  margin-bottom: 20px;
`;

const AlarmFrequency = styled.div`
  margin-bottom: 20px;
`;

const AlarmTime = styled.div`
  margin-bottom: 20px;

  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;
