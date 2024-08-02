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

export const fetchPillDataByImage = async (
  image: string,
  limit: number = 10,
  offset: number = 0
) => {
  try {
    const params = new URLSearchParams();
    params.append('image', image);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const data = await get(`/api/pills/search/image?${params.toString()}`);

    console.log('이미지로 검색 Get:', data);
    if (data.pills && data.pills.length > 0) {
      return data.pills;
    }
  } catch (error) {
    console.error('약데이터(image) 가져오기 실패:', error);
    throw error;
  }
};

export const fetchAutocompleteSuggestions = async (name: string) => {
  try {
    const data = await get(`/api/pills/search/name`, {
      name,
      limit: 10,
      offset: 0
    });
    console.log('자동완성 데이터:', data);
    if (data && data.pills) {
      return data.pills.map((pill: { name: string }) => pill.name);
    } else {
      throw new Error('자동완성 잘못된 응답 형식');
    }
  } catch (error) {
    console.error('자동완성 데이터 가져오기 실패:', error);
    throw error;
  }
};
