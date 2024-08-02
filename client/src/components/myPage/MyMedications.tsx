import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import BottomSheet from '../BottomSheet';
import { ChangeEvent, useEffect, useState } from 'react';
import { addMyPills, fetchMyPills } from '../../api/myMedicineApi';
import Loading from '../Loading';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages';
import { useNavigate } from 'react-router-dom';

interface MedicationItem {
  title: string;
  expiration: string;
}

const MyMedications = () => {
  const [bottomSheet, setBottomSheet] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [popupType, setPopupType] = useState(PopupType.None);
  const navigate = useNavigate();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = () => {
    fetchMyPills(
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

  const renderItems = (item: MedicationItem, key: number) => {
    return (
      <Item key={key}>
        <div className='title'>
          {item.title}
          <Icon
            icon='ep:arrow-right-bold'
            width='1.2em'
            height='1.2em'
            style={{ color: 'black' }}
          />
        </div>
        <div className='registration'>유효기간 {item.expiration}</div>
      </Item>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>
          총 {itemCount}개{' '}
          <Icon
            onClick={() => setBottomSheet(true)}
            icon='basil:add-solid'
            width='2rem'
            height='2rem'
            style={{ color: '#ffbb25' }}
          />
        </div>
        <div className='info'>📍폐의약품 전용수거함 위치</div>
        <div className='items'>
          {items.map((item, index) => renderItems(item, index))}
        </div>

        <Sheet>
          <BottomSheet
            isVisible={bottomSheet}
            onClose={() => setBottomSheet(false)}
          >
            <div className='title'>내 약 추가</div>

            <div className='info-box'>
              <div className='title2'>약 이름</div>
              <div className='input-container'>
                <input
                  type='text'
                  placeholder='약 이름'
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
            </div>

            <div className='info-box'>
              <div className='title2'>
                사용 기한{' '}
                <Icon
                  icon='ep:mute-notification'
                  width='1.3rem'
                  height='1.3rem'
                  style={{ color: 'gray' }}
                />
              </div>
              <div className='input-container'>
                <input
                  type='date'
                  placeholder='직접 입력 또는 사진으로 등록'
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <button
              className='bottomClose'
              onClick={() => {
                setLoading(true);
                addMyPills(name, date.toString(), () => {
                  setBottomSheet(false);
                  setLoading(false);
                  fetchDatas();
                });
              }}
            >
              등록 완료
            </button>
          </BottomSheet>
        </Sheet>
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

const Sheet = styled.div`
  .title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .title2 {
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
  }

  .info-box {
    margin-bottom: 20px;
  }

  .input-container {
    position: relative;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  input {
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
  }
  .bottomClose {
    margin-top: 20px;
  }
`;

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

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .info {
    margin-bottom: 30px;
    font-weight: 500;
    margin-left: -5px;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 30px;
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
    font-weight: bold;
    font-size: 1.2em;
  }

  .registration {
    font-size: 0.8em;
  }

  .delete-button {
    position: absolute;
    right: 10px;
    background-color: #d9d9d9;
    border: none;
    border-radius: 25px;
    padding: 3px 8px;
    cursor: pointer;
    font-size: 0.9em;
  }
`;

export default MyMedications;
