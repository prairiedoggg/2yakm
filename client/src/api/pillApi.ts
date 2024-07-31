import { get } from './api';

export const fetchPillDataByName = async (
  name: string,
  limit: number = 1,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/name`, { name, limit, offset });
    console.log('이름으로 검색 Get:', data);
    if (data.pills && data.pills.length > 0) {
      return data.pills[0];
    }
  } catch (error) {
    console.error('약데이터(name) 가져오기 실패:', error);
    throw error;
  }
};

export const listPillDataByName = async (
  name: string,
  limit: number = 10,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/name`, { name, limit, offset });
    console.log('이름으로 검색 list Get:', data);
    return data[0];
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
    throw error;
  }
};

export const fetchPillListByEfficacy = async (
  efficacy: string,
  limit: number = 10,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/efficacy`, {
      efficacy,
      limit,
      offset
    });
    console.log('효능으로 검색 Get:', data);
    if (data.pills && data.pills.length > 0) {
      return data.pills;
    }
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
  }
};
