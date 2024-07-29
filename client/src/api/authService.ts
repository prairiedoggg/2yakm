import { post, del,patch } from './api';
import useUserStore from '../store/user';
import Cookies from 'js-cookie';
import base64 from 'base-64';


export const login = async (email: string, password: string, onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await post('/api/auth/login', { email: email, password });
    console.log(data);
    storeLoginData(data);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Login failed', error);
    if (onFailure) onFailure(error);
  }
};

export const deleteAccount = async (userId: string, onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await del('/api/auth/delete-account', { userId: userId });
    useUserStore.getState().clearUser();
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('delete Account failed', error);
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
  onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void
) => {
  try {
    const data = await patch('/api/auth/change-password', {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword
    });

    if (onSuccess) onSuccess(data);
    
  } catch (error) {
    if (onFailure) onFailure(error);
    console.error('changePassword failed', error);
  }
};

const storeLoginData = (data: any) => {
  const userData = decodingToken(data.token);
  if (data && userData) useUserStore.getState().setUser(data.userName, data.email, data.profileimg, userData.id);
  console.log(useUserStore.getState().user);
  if (data.token) Cookies.set('token', `${data.token}`, { path: '/' });
};

const decodingToken = (token: string) =>{
  let payload = token.substring(token.indexOf('.')+1, token.lastIndexOf('.'));
  let decodingInfo = base64.decode(payload);
  return JSON.parse(decodingInfo);
}
