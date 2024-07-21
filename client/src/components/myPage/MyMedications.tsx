/**
File Name : MyMedications
Description : 내 약
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';

type MedicationItem = {
  title:string,
  expiration :string,
}

const MyMedications = () => {
  const items: MedicationItem[] = [ // test
    {
      title: '타이레놀',
      expiration: '2023.05.14',
    },
    {
      title: '타이레놀',
      expiration: '2023.05.14',
    },
    {
      title: '타이레놀',
      expiration: '2023.05.14',
    },
  ];    

  const renderItems = (item : MedicationItem) =>{
    return (
      <Item>
        <div className='title'>{item.title}<Icon icon="ep:arrow-right-bold" width='1.2em' height='1.2em' style={{ color: 'black' }} /></div>
        <div className='registration'>유효기간 {item.expiration}</div>
      </Item>
    );
  }

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>총 {items.length}개</div>
        <div className='items'>
          {items.map((item) => renderItems(item))}
        </div>
      </StyledContent>
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  height:70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding:0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  gap:30px;
  padding-top:20px;

  .totalCount{    
    font-weight:500;
  }

  .items{
   display: flex;
    flex-direction: column;
    gap:30px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap:5px;

  hr{
    width:100%;
  }

  .title{
    display: flex;
    font-weight:bold;
    font-size:1.2em;
  }

  .registration{
    font-size:.8em;
  }

  .delete-button {
    position: absolute;
    right: 10px;
    background-color: #D9D9D9;
    border: none;
    border-radius: 25px; 
    padding: 3px 8px;
    cursor: pointer;
    font-size:.9em;
  }  
`;

export default MyMedications;
