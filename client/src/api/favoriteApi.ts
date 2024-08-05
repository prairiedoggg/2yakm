import { PillData } from '../store/pill';
import { get, post } from './api';

export const fetchFavoriteStatusApi = async (pill: Pick<PillData, 'id'>) => {
  try {
    const data = await get(`/api/favorites/${pill.id}/status`);
    console.log('좋아요 get:', data);
    return data.isFavorite;
  } catch (error) {
    console.error('좋아요상태 실패:', error);
    throw error;
  }
};

export const fetchFavoriteCount = async (pill: Pick<PillData, 'id'>) => {
  try {
    const data = await get(`/api/pills/${pill.id}/favoritecount`);
    console.log('좋아요 수:', data);
    return data.count;
  } catch (error) {
    console.error('즐겨찾기 수 가져오기 실패:', error);
    throw error;
  }
};

export const toggleFavoriteApi = async (
  pill: Pick<PillData, 'id'>,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post(`/api/favorites/${pill.id}`, { pillId: pill.id });
    console.log('좋아요 post:', data);
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    console.error('좋아요토글 실패:', error);
    if (onFailure) onFailure(error);
    throw error;
  }
};

export const fetchMyFavorites = async (
  offset: number,
  limit?: number,
  sortedBy?: string,
  order?: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await get('/api/favorites', {
      offset: offset,
      limit: limit,
      sortedBy: sortedBy,
      order: order
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('fetchMyFavorites failed', error);
    if (onFailure) onFailure(error);
  }
};
