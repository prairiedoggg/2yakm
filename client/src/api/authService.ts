import { post } from './api';
import useUserStore from '../store/user';

export const login = async (email: string, password: string) => {
  try {
    const data = await post('/api/auth/login', { username: email, password });
    storeLoginData(data);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const loginForKakao = async (code:string) => {
    try {
      const data = await post('/api/auth/kakao/callback', { code: code });
      storeLoginData(data);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

export const loginForGoogle = async (code:string) => {
    try {
      const data = await post('/api/auth/google/callback', { code: code });
      storeLoginData(data);
    } catch (error) {
      console.error('Login failed', error);
    }
};  

const storeLoginData = (data:any)=>{
    if(data.user){
        useUserStore.getState().setUser(data.user);
    }

    if (data.token) {
        localStorage.setItem('token', data.token);
        checkAuthentication();
    }
}

export const logout = async () => {
  try {
    await post('/api/auth/logout', {});
    useUserStore.getState().clearUser();
  } catch (error) {
    console.error('Logout failed', error);
  }
};

function checkAuthentication() {
    throw new Error('Function not implemented.');
}
