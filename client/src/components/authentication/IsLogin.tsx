import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

export const isLogin = async (
  code: string,
  setToken: (token: string) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  navigate: NavigateFunction
) => {
  try {
    const res = await axios.get('http://localhost:3000/auth/kakao/callback', {
      params: { code }
    });
    setToken(res.data.token);
    setIsAuthenticated(true);
    navigate('/');
  } catch (err) {
    window.alert('로그인에 실패하였습니다');
    navigate('/login');
  }
};
