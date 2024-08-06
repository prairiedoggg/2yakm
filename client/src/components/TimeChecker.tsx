import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alarm, useAlarmStore } from '../store/alarm';
import Popup from './popup/Popup';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';

const TimeChecker = () => {
  const { alarms } = useAlarmStore();
  const [currentPills, setCurrentPills] = useState<string[] | undefined>(
    ['sdsd'] /*undefined*/
  );
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const formattedTime = `${hours}:${minutes}`;
      setCurrentTime(formattedTime);

      console.log(formattedTime);
      console.log(alarms);

      alarms.map((alarm) => {
        console.log(alarm);

        alarm.times.map((time) => {
          console.log(time); //
          if (time.time == formattedTime) updatePills(alarm);
        });
      });
    };

    const intervalId = setInterval(checkTime, 60000);
    //const intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const updatePills = (alarm: Alarm) => {
    setCurrentPills((prev) => {
      const prevPills = prev ?? [];

      const updatedPills = prevPills.includes(alarm.name)
        ? prevPills
        : [...prevPills, alarm.name];

      return updatedPills;
    });
  };

  const getPills = () => {
    let pills = '';

    currentPills?.map((pill, index) => {
      pills += pill;

      if (currentPills.length - 1 > index) pills += ', ';
    });
    return pills;
  };

  return (
    <Container>
      {(currentPills?.length ?? 0) > 0 && (
        <Popup onClose={() => setCurrentPills(undefined)}>
          <div className='center'>
            <Icon
              icon='line-md:alert-circle-twotone-loop'
              width='3rem'
              height='3rem'
              style={{ color: '#db9c14' }}
            />
            <br /> <b>{currentTime}</b>
            <br />약 먹을 시간입니다!
            <br />
            <br />
            <div className='pill-list'>{getPills()}</div>
            <button>먹었어요</button>
          </div>
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.nav`
  .center {
  }

  .pill-list {
    background-color: #d9d9d9;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
`;
export default TimeChecker;
