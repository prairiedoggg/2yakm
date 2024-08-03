import { Icon } from '@iconify-icon/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchUserAllReview, deleteReview } from '../../api/reviewApi';
import Loading from '../Loading';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages';
import { useNavigate } from 'react-router-dom';

interface MedicationItem {
  id: number;
  name: string;
  createdAt: string;
  content: string;
}

const ManageReviews = () => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [selected, setSelected] = useState<MedicationItem>();
  const [popupType, setPopupType] = useState(PopupType.None);
  const navigate = useNavigate();

  const fetchDatas = () => {
    setLoading(true);

    fetchUserAllReview(
      10,
      0,
      'createdAt',
      'DESC',
      (data) => {
        const reviews = data.data;
        const temp: MedicationItem[] = reviews.map((d: any) => ({
          id: d.id,
          name: d.name,
          content: d.content,
          createdAt: new Date(d.createdat).toDateString()
        }));
        setLoading(false);
        setItems(temp);
        setItemCount(data.totalCount);
      },
      () => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.DeleteReview:
        return (
          <div>
            <b>{selected?.name}</b>해당 리뷰를 삭제하시겠어요?
            <button
              className='bottomClose'
              onClick={() => {
                setLoading(true);

                deleteReview(
                  selected?.id ?? -1,
                  () => {
                    setLoading(false);
                    setSelected(undefined);
                    fetchDatas();
                  },
                  () => {
                    setPopupType(PopupType.DeleteFavoriteFailure);
                    setSelected(undefined);
                    setLoading(false);
                  }
                );
              }}
            >
              리뷰제거
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };

  const renderItems = (item: MedicationItem, showHr: boolean, key: number) => {
    return (
      <Item key={key}>
        <div className='title'>
          <div className='name_ko'>{item.name}</div>
          <div className='name_en'>{item.createdAt}</div>
          {deleteItem ? (
            <div
              className='delete-button'
              onClick={() => {
                setSelected(item);
                setPopupType(PopupType.DeleteReview);
              }}
            >
              삭제
            </div>
          ) : (
            ''
          )}
        </div>
        <div className='desc'>{item.content}</div>
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
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {getPopupContent(popupType)}
        </Popup>
      )}
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
