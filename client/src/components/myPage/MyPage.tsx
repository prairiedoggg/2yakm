/**
File Name : MyPage
Description : 마이페이지
Author : 오선아

History
Date        Author   Status    Description
2024.07.17  오선아   Created
*/

import styled from 'styled-components';
import Header from '../Header';
import MyInformation from './MyInformation.tsx';

import Nav from '../Nav';
import { Icon } from '@iconify-icon/react';



const MyPage = () => {

  const menus = [
    {name : '나의 약', href : '/MyMedications'}, 
    {name : '즐겨찾는 약', href : '/FavoriteMedications'}, 
    {name : '리뷰관리', href : '/ManageReviews'}]

  const renderMenuItems = () => {
    return menus.map((menu, index) => (
      <div key={index}>
        <div className='entry' onClick={() => window.location.href = menu.href}>
          <div>{menu.name}</div>
          <Icon icon="ep:arrow-right-bold" width="1.4em" height="1.4em" style={{ color: "#FFBB25" }} />
        </div>
        <hr />
      </div>
    ));
  };

  return (
    <MyPageContainer>
      <Header />

      <StyledContent>
        <MyInformation/>
        <div className='entries'>
          <hr/>
          {renderMenuItems()}
        </div>
      </StyledContent>

      <Nav />
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  overflow: hidden;

`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  gap: 10px;

  hr{
    width:90%;
  }

  .entries{
    display: flex;
    gap: 10px;
    flex-direction: column;

    .entry{
      display: flex;
      justify-content: space-between;
      align-content: center;
      width:90%;
      margin-left:20px;
    }    
  }

`;

export default MyPage;
