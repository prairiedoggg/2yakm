import { Icon } from '@iconify-icon/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchUserAllReview } from '../../api/reviewApi';
import Loading from '../Loading';

interface MedicationItem {
  title: string;
  titleEn: string;
  desc: string;
}

const ManageReviews = () => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  let items: MedicationItem[] = [];
  // = [
  //   // test
  //   {
  //     title: '타이레놀',
  //     titleEn: 'Tylenol Tablet 500mg',
  //     desc: '종합 감기약으로 타이레놀 좋습니다.'
  //   },
  //   {
  //     title: '타이레놀',
  //     titleEn: 'Tylenol Tablet 500mg',
  //     desc: '종합 감기약으로 타이레놀 좋습니다.'
  //   },
  //   {
  //     title: '타이레놀',
  //     titleEn: 'Tylenol Tablet 500mg',
  //     desc: '종합 감기약으로 타이레놀 좋습니다.'
  //   }
  // ];

  useEffect(() => {
    setLoading(true);
    const data = fetchUserAllReview(
      10,
      0,
      'createdAt',
      'DESC',
      (data) => {
        // items = data.data.map(({ name, createdAt, content }) => ({
        //   title: name,
        //   titleEn: createdAt,
        //   desc: content
        // }));
        setLoading(false);
        setItemCount(data.totalCount);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  const renderItems = (item: MedicationItem, showHr: boolean, key: number) => {
    return (
      <Item key={key}>
        <div className='title'>
          <div className='name_ko'>{item.title}</div>
          <div className='name_en'>{item.titleEn}</div>
          {deleteItem ? <div className='delete-button'>삭제</div> : ''}
        </div>
        <div className='desc'>{item.desc}</div>
        {showHr ? <hr /> : ''}
      </Item>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>
          내가 쓴 총 리뷰 {itemCount}개{' '}
          <Icon
            onClick={() => setDeleteItem(!deleteItem)}
            icon='ic:baseline-edit'
            width='1.3rem'
            height='1.3rem'
            style={{ color: '#d1d1d1' }}
          />
        </div>
        <div className='items'>
          {items.map((item, index) =>
            renderItems(item, index < items.length - 1, index)
          )}
        </div>
      </StyledContent>
      {loading && <Loading />}
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  height: 70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  hr {
    width: 100%;
  }

  .title {
    display: flex;
    gap: 5px;
  }

  .name_ko {
    font-weight: bold;
    font-size: 1.2em;
  }

  .name_en {
    color: gray;
    font-size: 0.8em;
  }

  .delete-button {
    position: absolute;
    right: 30px;
    background-color: #d9d9d9;
    border: none;
    border-radius: 25px;
    padding: 3px 8px;
    cursor: pointer;
    font-size: 0.9em;
  }
`;

export default ManageReviews;
