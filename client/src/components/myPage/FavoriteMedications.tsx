/**
File Name : EditMyInformation
Description : 내 정보 수정 페이지
Author : 오선아

History
Date        Author   Status    Description
2024.07.19  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type MedicationItem = {
  title:string,
  registrationDate:string,
  tags:string[],
}

const FavoriteMedications = () => {
  const items: MedicationItem[] = [ // test
    {
      title: '타이레놀',
      registrationDate: '2023.05.14',
      tags: ['두통', '신경통', '근육통']
    },
    {
      title: '타이레놀',
      registrationDate: '2023.06.01',
      tags: ['두통', '발열']
    },
    {
      title: '타이레놀',
      registrationDate: '2023.06.15',
      tags: ['감기', '두통']
    }
  ];    

  const renderItems = (item : MedicationItem) =>{
    return (
      <Item>
        <div className='title'>{item.title}<Icon icon="ep:arrow-right-bold" width='1.2em' height='1.2em' style={{ color: 'black' }} /></div>
        <div className='registration'>등록일 {item.registrationDate}</div>
        <TagContainer>
          {item.tags.map((tag, index) => (
            <Tag key={index} to={`/search/tag/${tag}`}>
              {tag}
            </Tag>
          ))}
        </TagContainer>
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
  gap:20px;
  padding-top:20px;

  .totalCount{    
    font-weight:500;
  }

  .items{
   display: flex;
    flex-direction: column;
    gap:30px;
    padding:0px 20px 0px 20px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap:5px;

  .title{
    display: flex;
    font-weight:bold;
    font-size:1.2em;
  }

  .registration{
    color:gray;
    font-size:.8em;
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
