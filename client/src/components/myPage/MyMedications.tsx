import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import BottomSheet from '../BottomSheet';
import { ChangeEvent, useState } from 'react';

interface MedicationItem {
  title: string;
  expiration: string;
}

const MyMedications = () => {
  const [bottomSheet, setBottomSheet] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  const items: MedicationItem[] = [
    // test
    {
      title: '타이레놀',
      expiration: '2023.05.14'
    },
    {
      title: '타이레놀',
      expiration: '2023.05.14'
    },
    {
      title: '타이레놀',
      expiration: '2023.05.14'
    }
  ];

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
          총 {items.length}개{' '}
          <Icon
            onClick={() => setBottomSheet(true)}
            icon='basil:add-solid'
            width='2rem'
            height='2rem'
            style={{ color: '#ffbb25' }}
          />
        </div>
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
              onClick={() => setBottomSheet(false)}
            >
              등록 완료
            </button>
          </BottomSheet>
        </Sheet>
      </StyledContent>
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
  gap: 30px;

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
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
