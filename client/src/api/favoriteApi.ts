import { get, post } from './api';



export const toggleFavoriteApi = async (id: string) => {
  try {
    await post(`/api/favorites/${id}`, id);
  } catch (error) {
    console.error('좋아요토글 실패:', error);
    throw error;
  }
};

export const fetchFavoriteStatusApi = async (id: string) => {
  try {
    const data = await get(`/api/favorites/${id}/status`);
    console.log(data);
    return data.isFavorite;
  } catch (error) {
    console.error('좋아요상태 실패:', error);
    throw error;
  }
};

export const fetchMyFavorites = async (offset:number, limit?:number, sortedBy?:string, order?:string, callback?:(arg0: any)=>void) => {
  try {
    const data = await get('/api/favorites', { offset:offset, limit:limit, sortedBy:sortedBy, order:order } );

    if (callback) callback(data);
  } catch (error) {
    console.error('Login failed', error);
  }
};