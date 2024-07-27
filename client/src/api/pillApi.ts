import { get } from './api';

export const fetchPillData = async (
  name: string,
  limit: number = 1,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/name`, { name, limit, offset });
    console.log('검색 Get:', data);
    if (data.pills && data.pills.length > 0) { 
      return data.pills[0];
    }
    
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
    throw error;
  }
};

export const listPillData = async (
  name: string,
  limit: number = 10,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/name`, { name, limit, offset });
    console.log('검색list Get:', data);
    return data[0];
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
    throw error;
  }
};
