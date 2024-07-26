import { post } from './api';
import useUserStore from '../store/user';
import Cookies from 'js-cookie';

export const login = async (email: string, password: string) => {
  try {
    const data = await post('/api/auth/login', { username: email, password });
    storeLoginData(data);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const logout = async (callback?: () => void) => {
  try {
    await post('/api/auth/logout', {});
    useUserStore.getState().clearUser();
    Cookies.remove('jwt');
    Cookies.remove('token');
    Cookies.remove('refreshToken');

    if (callback) callback();
  } catch (error) {
    console.error('Logout failed', error);
  }
};

export const loginForKakao = async (code: string) => {
  try {
    const data = await post('/api/auth/kakao/callback', { code: code });
    storeLoginData(data);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const loginForGoogle = async (code: string) => {
  try {
    const data = await post('/api/auth/google/callback', { code: code });
    storeLoginData(data);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  callback?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/change-password', {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
    if (callback) {
      callback(data);
    }
  } catch (error) {
    console.error('Login failed', error);
  }
};

const storeLoginData = (data: any) => {
  if (data.user) useUserStore.getState().setUser(data.user);

  if (data.token) Cookies.set('jwt', `${data.token}`, { path: '/' });
};
