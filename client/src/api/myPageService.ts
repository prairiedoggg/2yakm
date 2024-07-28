import { put } from './api';
import useUserStore from '../store/user';

export const changeUserName = async (userName: string,  onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put('/api/mypage', { "username": userName });
      if (onSuccess) onSuccess();

      useUserStore.getState().setUserName(data.username);
    } catch (error) {
      console.error('change UserName failed', error);
      if (onFailure) onFailure(error);
    }
  };