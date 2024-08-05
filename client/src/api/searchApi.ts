import axios from 'axios';
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

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const fetchPillDataByImage = async (
  image: File,
  limit: number = 10,
  offset: number = 0
) => {
  try {
    const base64Image = await toBase64(image);
    const params = new URLSearchParams();
    params.append('image', base64Image);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await axios.get(
      `/api/pills/search/image?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200 && response.data.pills) {
      return response.data.pills;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error fetching pill data by image:', error);
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

    if (data && data.pills.length > 0) {
      return data.pills;
    } else {
      throw new Error('자동완성 잘못된 응답 형식');
    }
  } catch (error) {
    console.error('자동완성 데이터 가져오기 실패:', error);
    throw error;
  }
};
