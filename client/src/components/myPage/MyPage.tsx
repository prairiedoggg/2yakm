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
import EditName from './EditName';
import ConfirmPassword from './ConfirmPassword';
import EditPassword from './EditPassword';

import Toast from '../Toast';
import Nav from '../Nav';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';

enum pageState {
  Main,
  EditInfo,
  EditName,
  ConfirmPassword,
  EditPassword,
  EditPharmacist,
  MyMedications,
  FavoriteMedications,
  ManageReviews,
}

const MyPage = () => {
  const [currentState, setCurrentState] = useState(pageState.Main); 

  const renderContent = () => {
    switch (currentState) {
      case pageState.EditInfo:
      case pageState.EditName:
      case pageState.ConfirmPassword:
      case pageState.EditPassword:
      case pageState.EditPharmacist:
      case pageState.MyMedications:  
      case pageState.FavoriteMedications:
      case pageState.ManageReviews:  
        return (
          <div>
            {renderPageTitle(currentState)}
            {renderStatePage(currentState)}
          </div>
        );

      default:
        return (
          <StyledContent>
            <MyInformation onEditInfo= {()=>{
              setCurrentState(pageState.EditInfo);}} />
            <div className='entries'>
              <hr/>
              {renderMenuItems()}
            </div>
          </StyledContent>
        );
    }
  };

  const renderStatePage = (state:pageState) =>{
    switch(state){
      case pageState.EditInfo:
        return (
        <EditMyInformation onEditNameClick={()=>setCurrentState(pageState.EditName)}
                           onEditPasswordClick={()=>setCurrentState(pageState.ConfirmPassword)}
                           onEditPharmacistClick={()=>setCurrentState(pageState.EditPharmacist)} />);

      case pageState.EditName:
        return (<EditName onEdit={()=> {
          setCurrentState(pageState.EditInfo);}} />);
      case pageState.ConfirmPassword:
        return (<ConfirmPassword onEdit={()=> {
          setCurrentState(pageState.EditPassword);}} />);
      case pageState.EditPassword:
        return (<EditPassword onEdit={()=> {
          setCurrentState(pageState.EditInfo);}} />);          
      case pageState.EditPharmacist:
        return (<div></div>);
      case pageState.MyMedications:
        return (<div></div>);
      case pageState.FavoriteMedications:
        return (<div></div>);
      case pageState.ManageReviews:
        return (<div></div>);
    }  
  }

  const getStateTitle = (state:pageState) =>{
    switch(state){
      case pageState.EditInfo:
        return "정보 수정";
      case pageState.EditName:
        return "이름 변경";
      case pageState.EditPassword:
      case pageState.ConfirmPassword:
        return "비밀번호 변경";
      case pageState.EditPharmacist:
        return "약사 인증";
      case pageState.MyMedications:
        return "나의 약";
      case pageState.FavoriteMedications:
        return "즐겨찾는 약";
      case pageState.ManageReviews:
        return "리뷰 관리";
    }
  }

  const getStateBackPage = (state:pageState) =>{
    switch(state){
      case pageState.EditName:
      case pageState.ConfirmPassword:
      case pageState.EditPassword:
      case pageState.EditPharmacist:
        return pageState.EditInfo;  

      default:
        return pageState.Main
    }
  }  

  const renderPageTitle = (state : pageState) =>{
    return (
      <PageTitle>
        <div className="title">
          <Icon icon="ep:arrow-left-bold" width='1.2em' height='1.2em' style={{ color: '#FFBB25' }} 
          onClick={() =>setCurrentState(getStateBackPage(state))} /> <div>{getStateTitle(state)}</div> 
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
      {/* <Toast str="이름 변경이 완료되었어요" /> */}

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
