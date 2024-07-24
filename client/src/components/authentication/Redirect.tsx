import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Redirect = ({ sns }: { sns: string }) => {
  const navigate = useNavigate();

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
          // 쿠키도 요청
          withCredentials: true
        })
        .then((res) => {
          if (res.data.token) {
            // 쿠키에 토큰 저장
            Cookies.set('jwt', `${res.data.token}`, { path: '/' });
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
  }, [sns, , navigate]);

  return null;
};

export default Redirect;
