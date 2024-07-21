/**
File Name : Login
Description : 로그인
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import SnsLogin from './SnsLogin';
import EmailLogin from './EmailLogin';

import { Icon } from '@iconify-icon/react';
import { useState } from 'react';

enum pageState {
  SnsLogin,
  EmailLogin
}

const Login = ({ isVisible, onClose } : {isVisible:boolean, onClose:()=>void}) => {
  const [currentState, setCurrentState] = useState(pageState.SnsLogin); 

  const renderContent = () => {
    switch (currentState) {
      case pageState.EmailLogin:
        return (<EmailLogin />);
      default:
        return (<SnsLogin onClose={onClose}
                          onEmailLoginClick={()=> setCurrentState(pageState.EmailLogin)} />);
    }
  };

  return (
    <Overlay isVisible={isVisible} onClick={onClose}>
      <Icon className='topClose' onClick={onClose} icon="material-symbols:close" width="1.7rem" height="1.7rem"  style={{color: "black"}} />
      {renderContent()}
    </Overlay>
  );
};

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  transition: opacity 0.3s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  z-index: 999;
  display:flex;
  flex-direction: column;
  gap:20px;

  .topClose{
    top: 10px;
    left: 10px;
    padding-left:10px;
    padding-top:10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
  }
`;

export default Login;
