import { useState } from 'react';
import styled from 'styled-components';
import { useReviewStore } from '../../store/review.ts';

const Review = () => {
  const { isWritingReview, toggleReviewForm } = useReviewStore();
   const [reviews, setReviews] = useState([
     {
       id: 1,
       user: '약사약사',
       content: '종합 감기약으로 타이레놀이 좋습니다.',
       bgColor: 'rgba(114,191,68, 0.1)'
     },
     {
       id: 2,
       user: '리뷰리뷰',
       content: '감기 걸렸을 땐 항상 타이레놀 먹어요.',
       bgColor: 'white'
     }
   ]);
  const [newReview, setNewReview] = useState('');
    const handleReviewSubmit = () => {
      const newReviewItem = {
        id: reviews.length + 1,
        user: '홍길동',
        content: newReview,
        bgColor: 'white'
      };
      setReviews([...reviews, newReviewItem]);
      setNewReview('');
      toggleReviewForm();
    };

  return (
    <ReviewContainer>
      <WriteReview onClick={toggleReviewForm}>리뷰 작성하기</WriteReview>
      {isWritingReview && (
        <ReviewForm>
          <textarea
            placeholder='리뷰를 작성해 주세요. 욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요.'
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <SubmitButton onClick={handleReviewSubmit}>완료</SubmitButton>
        </ReviewForm>
      )}
      <ReviewList>
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            style={{ backgroundColor: review.bgColor }}
          >
            <User>
              <Profile src={`/img/user.svg`} alt='유저' />
              <span>{review.user}</span>
            </User>
            <p>{review.content}</p>
          </ReviewItem>
        ))}
      </ReviewList>
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
