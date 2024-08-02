import { get, post, del } from './api';

export const fetchReviews = async ({
  pillId,
  initialLimit = 10,
  cursorLimit = 10,
  cursor = null
}: {
  pillId: number;
  initialLimit?: number;
  cursorLimit?: number;
  cursor?: string | null;
}) => {
  try {
    const params = new URLSearchParams();
    if (initialLimit) params.append('initialLimit', initialLimit.toString());
    if (cursorLimit) params.append('cursorLimit', cursorLimit.toString());
    if (cursor) params.append('cursor', cursor);

    const data = await get(`/api/reviews/pills/${pillId}?${params.toString()}`);
    console.log('리뷰 get:', data);
    return data;
  } catch (error) {
    console.error('리뷰불러오기 에러:', error);
    throw error;
  }
};

export const createReview = async (review: {
  content: string;
  pillId: number;
}) => {
  try {
    const payload = {
      content: review.content,
      pillid: review.pillId
    };
    console.log('리뷰 생성 요청:', payload);
    const data = await post(`/api/reviews`, payload);
    console.log('리뷰 post 성공:', data);
    return data;
  } catch (error) {
    console.error('리뷰생성 에러:', error);
    throw error;
  }
};

export const deleteReview = async (
  id: number,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await del('/api/reviews', { id: id });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};

export const fetchReviewCount = async (pillId: string) => {
  try {
    const data = await get(`/api/pills/${pillId}/reviewcount`);
    console.log('리뷰수:', data);
    return data.count;
  } catch (error) {
    console.log('리뷰 수 가져오기 실패:', error);
  }
};

export const fetchUserAllReview = async (
  limit: number,
  offset: number,
  sortedBy: string,
  order: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await get('/api/reviews/users', {
      limit: limit,
      offset: offset,
      sortedBy: sortedBy,
      order: order
    });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};
