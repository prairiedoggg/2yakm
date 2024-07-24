import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../store/authentication';
import axios from 'axios';

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const { setToken, setIsAuthenticated } = useAuthentication();

  useEffect(() => {
    console.log(window.location.href);
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      axios
        .get('http://localhost:3000/api/auth/kakao/callback', {
          params: { code: code }
        })
        .then((res) => {
          if (res.data.token) {
            setToken(res.data.token);
            console.log('토큰', res.data.token);
            setIsAuthenticated(true);
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

export default KakaoRedirect;
