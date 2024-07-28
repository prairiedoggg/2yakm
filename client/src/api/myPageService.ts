import { put, get } from './api';
import useUserStore from '../store/user';

export const fetchUserProfile = async ( onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await get('/api/mypage' );
    if (onSuccess) onSuccess();

    useUserStore.getState().setUser(data.username, data.email, data.profileimg);
  } catch (error) {
    console.error('change UserName failed', error);
    if (onFailure) onFailure(error);
  }
};

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


  export const changeProfileImage = async (profileImage: FormData,  onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put('/api/mypage/profile-picture/memory', { "profilePicture": profileImage });
      if (onSuccess) onSuccess();

      useUserStore.getState().setProfileimg(data.profileimg);
    } catch (error) {
      console.error('change ProfileImage failed', error);
      if (onFailure) onFailure(error);
    }
  };