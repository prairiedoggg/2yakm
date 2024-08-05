import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginSuccess = () => {
      const success = '로그인 성공';
      Cookies.set('login', success);
    };

    loginSuccess();
    navigate('/');
  }, [navigate]);

  return null;
};

export default Redirect;
