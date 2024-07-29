import { useState } from 'react';
import styled from 'styled-components';
import create from 'zustand';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  fetchReviews,
  createReview,
  type Review
} from '../../api/reviewApi';



interface ReviewState {
  isWritingReview: boolean;
  toggleReviewForm: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  isWritingReview: false,
  toggleReviewForm: () =>
    set((state) => ({ isWritingReview: !state.isWritingReview }))
}));

const Review = () => {
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState('');
  const { isWritingReview, toggleReviewForm } = useReviewStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['reviews'],
      queryFn: fetchReviews,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0
    });
  
  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const handleReviewSubmit = async () => {
    const newReviewItem = {
      content: newReview
    };
    await mutation.mutateAsync(newReviewItem);
    setNewReview('');
    toggleReviewForm();
  };

  return (
    <ReviewContainer>
      <WriteReview onClick={toggleReviewForm}>리뷰 작성하기</WriteReview>
      {isWritingReview && (
        <ReviewForm>
          <textarea
            placeholder='리뷰를 작성해 주세요.&#10;욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요.'
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <SubmitButton onClick={handleReviewSubmit}>완료</SubmitButton>
        </ReviewForm>
      )}
      <ReviewList>
        {data?.pages.map((page) =>
          page.reviews.map((review) => (
            <ReviewItem
              key={review.id}
              style={{
                backgroundColor: review.role ? 'rgba(114,191,68, 0.1)' : 'white'
              }}
            >
              <User>
                <Profile src={`/img/user.svg`} alt='유저' />
                <span>{review.name}</span>
              </User>
              <p>{review.content}</p>
            </ReviewItem>
          ))
        )}
      </ReviewList>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? '로딩 중...' : '더 불러오기'}
        </button>
      )}
    </ReviewContainer>
  );
};

export default Review;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 30px 100px;
`;

const WriteReview = styled.button`
  margin-left: auto;
  width: 135px;
  height: 35px;
  background-color: #ffffff;
  border: 1px solid var(--secondary-color);
  border-radius: 10px;
`;

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  & textarea {
    width: 90%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    resize: none;
  }
`;

const SubmitButton = styled.button`
  width: 60px;
  height: 30px;
  margin-top: 10px;
  align-self: flex-end;
  background-color: #ffd700;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
`;

const ReviewList = styled.ul`
  width: 100%;
`;

const ReviewItem = styled.li`
  margin: 20px 0;
  padding: 15px;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  & p {
    margin-top: 10px;
    font-size: 14px;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;

  & span {
    margin-left: 7px;
    font-size: 15px;
    font-weight: 500;
  }
`;

const Profile = styled.img``;
