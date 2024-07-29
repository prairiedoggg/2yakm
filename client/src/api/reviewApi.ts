import { get, post, del } from './api';

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

export const fetchReviews = async ({
  pageParam = 0
}): Promise<ReviewsResponse> => {
  try {
    const data = await get(`/api/reviews/pills/{pillId}`, {
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

export const deleteReview = async (id:number, onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) =>{
  try {
    const data = await del('/api/reviews', { id:id });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};

export const fetchUserAllReview = async (limit: number, offset:number, sortedBy:string, order:string, onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await get('/api/reviews/users', { limit: limit, offset:offset, sortedBy:sortedBy, order:order });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};