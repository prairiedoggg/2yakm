import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pill, useMyPillStore } from '../store/myPill';
import { useAllAlarmStore } from '../store/allAlarms';
import Popup from './popup/Popup';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';

const PillExpiredAlarmChecker = () => {
  const { pills } = useMyPillStore();
  const {
    currentExpiredAlarms,
    confirmedExpiredAlarms,

    setCurrentExpiredAlarms,
    addCurrentExpiredAlarms,
    addConfirmedExpiredAlarms,

    nextExpiredAlarmTime,

    setNextExpiredAlarmTime
  } = useAllAlarmStore();
  const [currentDate, setCurrentDate] = useState('');
  let intervalId: NodeJS.Timeout;

  const checkTime = () => {
    const now = new Date();
    setCurrentDate(getDateString(now));

    pills.forEach((pill) => {
      if (!pill.alarmStatus) return;

      if (nextExpiredAlarmTime != undefined && nextExpiredAlarmTime > now)
        return;

      if (!pill.expiredat) return;

      if (getDateString(new Date(pill.expiredat)) != currentDate) return;

      updateExpiredAlarm(pill);
    });
  };

  const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();

    return `${year}. ${month}. ${day}`;
  };

  useEffect(() => {
    if (!intervalId) intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, [
    pills,
    currentExpiredAlarms,
    confirmedExpiredAlarms,
    currentDate,
    nextExpiredAlarmTime
  ]);

  const updateExpiredAlarm = (alarm: Pill) => {
    const prevAlarms = currentExpiredAlarms ?? [];
    let alarmInfo = { id: alarm.id, name: alarm.name };

    const alreadyExists = prevAlarms.some(
      (existingAlarm) => existingAlarm.id === alarm.id
    );

    const alreadyConfirmed = confirmedExpiredAlarms?.some(
      (existingAlarm) => existingAlarm.id === alarm.id
    );

    if (!alreadyExists && !alreadyConfirmed)
      addCurrentExpiredAlarms([alarmInfo]);
  };

  const confirmCurrentExpiredAlarms = () => {
    addConfirmedExpiredAlarms(currentExpiredAlarms);
  };

  const getExpiredAlarmsName = () => {
    let names = '';
    currentExpiredAlarms?.map((alarm, index) => {
      names += alarm.name;

      if (currentExpiredAlarms.length - 1 > index) names += ', ';
    });
    return names;
  };

  const addSecondsToDate = (date: Date, seconds: number) => {
    return new Date(date.getTime() + seconds * 1000);
  };

  return (
    <Container>
      {(currentExpiredAlarms?.length ?? 0) > 0 && (
        <Popup
          onClose={() => {
            setCurrentExpiredAlarms([]);
            setNextExpiredAlarmTime(addSecondsToDate(new Date(), 10));
          }}
        >
          <div className='center'>
            <Icon
              icon='line-md:alert-circle-twotone-loop'
              width='3rem'
              height='3rem'
              style={{ color: 'red' }}
            />
            <br /> <b>만료일 - {currentDate}</b>
            <br />
            해당 약이 오늘 일자로 만료되었습니다.
            <br />
            만료된 약물의 복용은 건강에 위험을 초래할 수 있습니다.
            <br />
            폐기 후 가까운 약국이나 병원에 방문하여 새로운 약을 처방받으세요.
            <br />
            <br />
            <div style={{ fontSize: '0.9rem' }}>(닫기 시 10초 뒤 재알람)</div>
            <br />
            <div className='pill-list'>{getExpiredAlarmsName()}</div>
            <button onClick={() => confirmCurrentExpiredAlarms()}>
              폐기했어요
            </button>
          </div>
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.nav`
  .pill-list {
    background-color: #d9d9d9;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
`;
export default PillExpiredAlarmChecker;
