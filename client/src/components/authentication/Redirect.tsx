import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserInformation } from '../../api/authService';

const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginSuccess = () => {
      const success = '로그인 성공';
      Cookies.set('login', success);
    };

    fetchUserInformation(() => {
      loginSuccess();
      navigate('/');
    });
  }, [navigate]);

  return null;
};

export default Redirect;
