import { Icon } from '@iconify-icon/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMyFavorites, toggleFavoriteApi } from '../../api/favoriteApi';
import Loading from '../Loading';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages';

interface MedicationItem {
  pillid: number;
  title: string;
  registrationDate: string;
  tags: string[];
}

const FavoriteMedications = () => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [popupType, setPopupType] = useState(PopupType.None);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchDatas = () => {
    setLoading(true);

    fetchMyFavorites(
      offset,
      limit,
      'createdAt',
      'DESC',
      (data) => {
        console.log(data);
        const favorites = data.data;
        const temp: MedicationItem[] = favorites.map((d: any) => ({
          pillid: Number(d.pillid),
          title: d.name,
          registrationDate: new Date(d.createdat).toDateString(),
          tags: d.efficacy.split(' ').map((text: string) => {
            if (text.length > 3) return text.slice(0, 3) + '...';
            else return text;
          })
        }));
        setLoading(false);

        setItems((prevData) => [...prevData, ...temp]);
        setOffset((prevOffset) => prevOffset + temp.length);
        setHasMore(temp.length === limit);

        setItemCount(data.totalCount);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const bottom =
      container.scrollHeight === container.scrollTop + container.clientHeight;

    if (bottom && !loading && hasMore) {
      fetchDatas();
    }
  }, [loading, hasMore, offset]);

  useEffect(() => {
    fetchDatas();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const renderItems = (item: MedicationItem, index: number) => {
    console.log(item);
    return (
      <Item key={index}>
        <div className='title'>
          <div className='title2'>
            {item.title}
            <Icon
              icon='ep:arrow-right-bold'
              width='1.2em'
              height='1.2em'
              style={{ color: 'black' }}
            />
          </div>

          {deleteItem ? (
            <div
              className='delete-button'
              onClick={() => {
                setLoading(true);
                toggleFavoriteApi(
                  { id: item.pillid },
                  () => {
                    setLoading(false);
                    fetchDatas();
                  },
                  () => {
                    setPopupType(PopupType.DeleteFavoriteFailure);
                    setLoading(false);
                  }
                );
              }}
            >
              삭제
            </div>
          ) : (
            ''
          )}
        </div>

        <div className='registration'>등록일 {item.registrationDate}</div>
        <TagContainer>
          {item.tags.slice(0, 3)?.map((tag, index) => (
            <Tag key={index} to={`/search/tag/${tag}`}>
              {tag}
            </Tag>
          ))}
        </TagContainer>
      </Item>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>
          총 {itemCount}개{' '}
          <Icon
            onClick={() => setDeleteItem(!deleteItem)}
            icon='ic:baseline-edit'
            width='1.3rem'
            height='1.3rem'
            style={{ color: '#d1d1d1' }}
          />
        </div>
        <div className='items'>
          {items.map((item, index) => renderItems(item, index))}
        </div>
      </StyledContent>
      {loading && <Loading />}
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {PopupContent(popupType, navigate)}
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
  gap: 20px;

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0px 20px 0px 20px;
    overflow: auto;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 80%;

  .title {
    display: flex;
    font-weight: bold;
    font-size: 1.2em;
    justify-content: space-between;
  }

  .title2 {
    display: flex;
    justify-content: space-between;
  }

  .registration {
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

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`;

const Tag = styled(Link)`
  width: 48px;
  height: 25px;
  margin-right: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 25px;
  border-radius: 5px;
  background-color: var(--main-color);
  cursor: pointer;
  text-decoration: none;
  color: black;
`;

export default FavoriteMedications;
