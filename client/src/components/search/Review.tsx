import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchReviews, createReview } from '../../api/reviewApi';
import { isUserLoggedIn } from '../../store/authService';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages.tsx';

export interface Review {
  id: number;
  pillId: number;
  name?: string;
  userid: string;
  username?: string;
  role?: boolean;
  content: string;
  profileimg?: string;
}

const Review = ({ pillId }: { pillId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const navigate = useNavigate();

  const loadReviews = async (pillId: number, cursor: string | null) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchReviews({ pillId, cursor });
      setReviews([...reviews, ...data.reviews]);
      setNextCursor(data.nextCursor || null);
      setReviewCount(data.reviewCount || 0);
    } catch (error) {
      console.error('리뷰불러오기 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    const newReviewItem = {
      content: newReview,
      pillId
    };
    try {
      const data = await createReview(newReviewItem);
      setReviews((prevReviews) => [data, ...prevReviews]);
      setNewReview('');
      setIsWritingReview(false);
    } catch (error) {
      console.error('리뷰생성 에러:', error);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading ||
      !nextCursor
    )
      return;
    loadReviews(pillId, nextCursor?.toString() || null);
  }, [pillId, nextCursor, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, pillId]);

  useEffect(() => {
    loadReviews(pillId, null);
  }, [pillId]);

  const handleWriteReviewClick = () => {
    if (!isUserLoggedIn()) {
      setPopupType(PopupType.LoginRequired);
      setShowLoginPopup(true);
      return;
    }
    setIsWritingReview(true);
  };

  return (
    <ReviewContainer>
      <WriteReview onClick={handleWriteReviewClick}>리뷰 작성하기</WriteReview>
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
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            style={{
              backgroundColor: review.role ? 'rgba(114,191,68, 0.1)' : 'white'
            }}
          >
            <User>
              <Profile
                src={review.profileimg ?? `/img/user.svg`}
                alt='프로필 이미지'
              />
              <span>{review.username}</span>
            </User>
            <p>{review.content}</p>
          </ReviewItem>
        ))}
      </ReviewList>
      {showLoginPopup && (
        <Popup onClose={() => setShowLoginPopup(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
      {isLoading && <LoadingText>로딩 중...</LoadingText>}
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

const LoadingText = styled.div`
  margin: 20px 0;
  font-size: 14px;
  color: gray;
`;
