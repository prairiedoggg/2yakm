import { get } from './api';

export const fetchPillData = async (name:string, limit: number = 1, offset: number = 0) => {
  try {
    const data = await get(`/pill/search/name`, {name, limit, offset });
    console.log(data);
    return data[0];
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
    throw error;
  }
};
