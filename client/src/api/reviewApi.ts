import { get, post } from './api';

export interface Review {
  id: string;
  pillid: string;
  name?: string;
  userid: string;
  username?: string;
  role?: boolean;
  content: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  nextCursor?: number;
}

interface FetchReviewsContext {
  pageParam?: number;
  queryKey: [string, string | null];
}

export const fetchReviews = async ({
  pageParam = 0,
  queryKey
}: FetchReviewsContext): Promise<ReviewsResponse> => {
  const [, pillId] = queryKey;
  try {
    const data = await get(`/api/reviews/pills/${pillId}`, {
      cursor: pageParam
    });
    console.log('리뷰 get:', data);
    return data;
  } catch (error) {
    console.error('리뷰불러오기 에러:', error);
    throw error;
  }
};

export const createReview = async (review: {
  content: string;
  pillid: string;
}): Promise<Review> => {
  try {
    const data = await post(`/api/reviews`, review);
    console.log('리뷰 post');
    return data;
  } catch (error) {
    console.error('리뷰생성 에러:', error);
    throw error;
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
