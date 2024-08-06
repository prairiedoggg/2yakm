import useUserStore, { LoginType } from '../store/user';

import { get, post } from './api';

export const fetchCertifications = async () => {
  try {
    const res = await get('/api/mypage/certifications');
    return res;
  } catch (error) {
    console.error('fetch Certifications failed', error);
  }
};

export const registCertifications = async (name:string, date:string, number:string) => {
    try {
      const res = await post('/api/mypage/certifications', {name, date, number});
      useUserStore.getState().setRole(res.role);
      return res;
    } catch (error) {
      console.error('fetch Certifications failed', error);
      throw error;
    }
  };