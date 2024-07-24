import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../store/authentication';
import axios from 'axios';

const Redirect = ({ sns }: { sns: string }) => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuthentication();

  useEffect(() => {
    let url = '';
    switch (sns) {
      case 'kakao':
        url = 'http://localhost:3000/api/auth/kakao/callback';
        break;
      case 'google':
        url = 'http://localhost:3000/api/auth/google/callback';
        break;
      default:
        console.error('알 수 없는 SNS');
        return;
    }

    console.log(window.location.href);
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      axios
        .get(url, {
          params: { code: code },
          withCredentials: true
        })
        .then((res) => {
          if (res.data.token) {
            document.cookie = `jwt=${res.data.token}; path=/`;
            localStorage.setItem('token', res.data.token);
            checkAuthentication();
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
          window.alert('로그인에 실패했습니다');
          navigate('/login');
        });
    } else {
      console.error('인증 코드 없음');
      navigate('/login');
    }
  }, [sns, checkAuthentication, navigate]);

  return null;
};

export default Redirect;
