import Cookies from 'js-cookie';

export const isUserLoggedIn = (): boolean => {
  console.log()
  return Cookies.get('login') === '로그인 성공';
};