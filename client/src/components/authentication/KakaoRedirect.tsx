import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../store/authentication';
import axios from 'axios';

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const { setCode, setToken, setIsAuthenticated } = useAuthentication();

  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams;
    const newCode = params.get('code');

    if (newCode) {
      setCode(newCode);

      axios
        .get('http://localhost:3000/api/auth/kakao/callback', {
          params: { code: newCode }
        })
        .then((res) => {
          if (res.data.token) {
            setToken(res.data.token);
            console.log(res.data.token);
            setIsAuthenticated(true);
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
          window.alert('로그인에 실패하였습니다');
          navigate('/login');
        });
    } else {
      console.error('인증 코드 없음');
      navigate('/login');
    }
  }, [navigate, setCode, setToken, setIsAuthenticated]);

  return null;
};

export default KakaoRedirect;
