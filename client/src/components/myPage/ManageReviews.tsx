/**
File Name : EditMyInformation
Description : 내 정보 수정 페이지
Author : 오선아

History
Date        Author   Status    Description
2024.07.19  오선아   Created
*/

import styled from 'styled-components';

type MedicationItem = {
  title:string,
  titleEn:string,
  desc:string,
}

const ManageReviews = () => {
  const items: MedicationItem[] = [ // test
    {
      title: '타이레놀',
      titleEn: 'Tylenol Tablet 500mg',
      desc: '종합 감기약으로 타이레놀 좋습니다.',
    },
    {
      title: '타이레놀',
      titleEn: 'Tylenol Tablet 500mg',
      desc: '종합 감기약으로 타이레놀 좋습니다.',
    },
    {
      title: '타이레놀',
      titleEn: 'Tylenol Tablet 500mg',
      desc: '종합 감기약으로 타이레놀 좋습니다.',
    },
  ];    

  const renderItems = (item : MedicationItem, showHr : boolean) =>{
    return (
      <Item>
        <div className='title'>
          <div className='name_ko'>{item.title}</div>
          <div className='name_en'>{item.titleEn}</div>
          <div className="delete-button">삭제</div>
        </div>
        <div className='desc'>{item.desc}</div>
        {showHr? <hr/> : ''}
    </Item>
    );
  }

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>내가 쓴 총 리뷰 {items.length}개</div>
        <div className='items'>
          {items.map((item, index) => renderItems(item, index < items.length-1))}
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
    gap:10px;
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
    gap: 5px;
  }

  .name_ko{
    font-weight:bold;
    font-size:1.2em;
  }

  .name_en{
    color:gray;
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

export default ManageReviews;
