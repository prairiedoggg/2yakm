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
import MyInformation from './MyInformation';
import EditMyInformation from './EditMyInformation';

import Nav from '../Nav';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';

enum pageState {
  Main,
  EditInfo,
  MyMedications,
  FavoriteMedications,
  ManageReviews,
}

const MyPage = () => {
  const [currentState, setCurrentState] = useState(pageState.Main); 

  const renderContent = () => {
    switch (currentState) {
      case pageState.EditInfo:
        return (
          <div>
            {renderPageTitle("정보수정")}
            <EditMyInformation />
          </div>
        );
      case pageState.MyMedications:
        return (
          <div>
            {renderPageTitle("나의 약")}
            {/* <MyMedications /> */}
          </div>
        );
      case pageState.FavoriteMedications:
        return (
          <div>
            {renderPageTitle("즐겨찾는 약")}
             {/* <FavoriteMedications /> */}
          </div>
        );
      case pageState.ManageReviews:
        return (
          <div>
            {renderPageTitle("리뷰관리")}
            {/* <ManageReviews /> */}
          </div>
        );
      default:
        return (
          <StyledContent>
            <MyInformation onEditInfo= {()=>setCurrentState(pageState.EditInfo)} />
            <div className='entries'>
              <hr/>
              {renderMenuItems()}
            </div>
          </StyledContent>
        );
    }
  };

  const renderPageTitle = (title : string) =>{
    return (
      <PageTitle>
        <div className="title">
          <Icon icon="ep:arrow-left-bold" width='1.2em' height='1.2em' style={{ color: '#FFBB25' }} 
          onClick={() =>setCurrentState(pageState.Main)} /> <div>{title}</div> 
        </div>
        <hr />
      </PageTitle>
    );
  }

  const menus = [
    {name : '나의 약', state : pageState.MyMedications}, 
    {name : '즐겨찾는 약', state : pageState.FavoriteMedications}, 
    {name : '리뷰관리', state : pageState.ManageReviews}]

  const renderMenuItems = () => {
    return menus.map((menu, index) => (
      <div key={index}>
        <div className='entry' onClick={() =>setCurrentState(menu.state)}>
          <div>{menu.name}</div>
          <Icon icon="ep:arrow-right-bold" width='1.3em' height='1.3em' style={{ color: '#FFBB25' }} />
        </div>
        <hr  />
      </div>
    ));
  };

  return (
    <MyPageContainer>
      <Header />
      {renderContent()}
      <Nav />
    </MyPageContainer>
  );
};

const PageTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  width:100%;
  height:70px;
  gap:5px;

  .title{
    display: flex;
    gap : 10px;
    width:95%;
    font-size:1.2em;
  }

  hr{
    width:90%;
  }
`;

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
    font-size:1em;

    .entry{
      display: flex;
      justify-content: space-between;
      align-content: center;
      width:90%;
      margin-left:20px;
      margin-bottom:15px;
    }    
  }

`;

export default MyPage;
