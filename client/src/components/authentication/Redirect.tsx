import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserInformation } from '../../api/authService';
import { getAlarms } from '../../api/alarmApi';
import { useAlarmStore } from '../../store/alarm';

const Redirect = () => {
  const navigate = useNavigate();
  const { setAlarms } = useAlarmStore();

  useEffect(() => {
    fetchUserInformation(() => {
      onFetchUserInformationSucceed();
    });
  }, [navigate]);

  const onFetchUserInformationSucceed = async () => {
    const loginSuccess = () => {
      const success = '로그인 성공';
      Cookies.set('login', success);
    };

    const data = await getAlarms();
    setAlarms(data);

    loginSuccess();
    navigate('/');
  };

  return null;
};

export default Redirect;
