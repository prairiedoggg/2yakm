import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../store/authentication';
// import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface RedirectProps {
  sns: string;
}

let url: string = '';

const handleUrl = (sns: string) => {
  switch (sns) {
    case 'kakao':
      return (url = 'http://localhost:3000/api/auth/kakao/callback');
    case 'google':
      return (url = 'http://localhost:3000/api/auth/google/callback');
    default:
      break;
  }
};

const Redirect = ({ sns }: RedirectProps) => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuthentication();

  useEffect(() => {
    handleUrl(sns);

    console.log(window.location.href);
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      axios
        .get(url, {
          params: { code: code }
        })
        .then((res) => {
          if (res.data.token) {
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
  }, []);

  return null;
};

export default Redirect;
