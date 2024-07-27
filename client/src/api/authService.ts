import { post } from './api';
import useUserStore from '../store/user';
import Cookies from 'js-cookie';

export const login = async (email: string, password: string, onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await post('/api/auth/login', { email: email, password });
    storeLoginData(data);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Login failed', error);
    if (onFailure) onFailure(error);
  }
};

export const signup = async (email: string, username:string, password: string, confirmPassword:string, onSuccess:()=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await post('/api/auth/signup', { email: email, username:username, password: password, confirmPassword:confirmPassword });
    storeLoginData(data);

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('signup failed', error);
    if (onFailure) onFailure(error);
  }
};

export const requestEmailVerification = async (email: string, onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await post('/api/auth/request-email-verification', { email: email });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('request Email Verification failed', error);
    if (onFailure) onFailure(error);
  }
};

export const logout = async (callback?:()=>void) => {
  try {
    await post('/api/auth/logout', {});
    useUserStore.getState().clearUser();
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
  if (data) useUserStore.getState().setUser(data.userName, data.email);
  if (data.token) Cookies.set('token', `${data.token}`, { path: '/' });
};
