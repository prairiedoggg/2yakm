/**
 * File Name : Review
 * Description : 리뷰
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.17  민선옥    Created
 * 2024.07.19  민선옥    tsx
 */

import styled from 'styled-components';


const Review = () => {
  return (
    <ReviewContainer>
      <WriteReview>리뷰 작성하기</WriteReview>
      <ReviewList>
        <ReviewItem
          style={{
            backgroundColor: 'rgba(114,191,68, 0.1)'
          }}
        >
          <User>
            <Profile src={`/img/user.svg`} alt='유저' />
            <span>약사약사</span>
          </User>
          <p>종합 감기약으로 타이레놀이 좋습니다.</p>
        </ReviewItem>
        <ReviewItem>
          <User>
            <Profile />
            <span>리뷰리뷰</span>
          </User>
          <p>감기 걸렸을 땐 항상 타이레놀 먹어요.</p>
        </ReviewItem>
        <ReviewItem>
          <User>
            <Profile />
            <span>리뷰리뷰</span>
          </User>
          <p>감기 걸렸을 땐 항상 타이레놀 먹어요.</p>
        </ReviewItem>
        <ReviewItem>
          <User>
            <Profile />
            <span>리뷰리뷰</span>
          </User>
          <p>감기 걸렸을 땐 항상 타이레놀 먹어요.</p>
        </ReviewItem>
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