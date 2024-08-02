import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = () => {
  const navigate = useNavigate();

  const loginSuccess = () => {
    const success: string = '로그인 성공';
    Cookies.set('login', success);
  };

  useEffect(() => {
    loginSuccess();
    navigate('/', { state: { showBottomSheet: true } });
  }, [navigate]);

  return null;
};

export default Redirect;
