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
import BottomEditNameSheet from './BottomEditNameSheet';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';

enum pageState {
  SnsLogin,
  EmailLogin
}

const Login = () => {
  const [currentState, setCurrentState] = useState(pageState.SnsLogin);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (currentState) {
      case pageState.EmailLogin:
        return <EmailLogin onRegisterClick={() => navigate('/register')} />;
      default:
        return (
          <SnsLogin
            onClose={() => navigate('/', { state: { showBottomSheet: true } })}
            onEmailLoginClick={() => setCurrentState(pageState.EmailLogin)}
            onEmailRegisterClick={() => navigate('/register')}
          />
        );
    }
  };

  return (
    <Overlay>
      <Icon
        className='topClose'
        onClick={() => {
          navigate('/');
        }}
        icon='material-symbols:close'
        width='1.7rem'
        height='1.7rem'
        style={{ color: 'black' }}
      />
      {renderContent()}
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  transition: opacity 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .topClose {
    top: 10px;
    left: 10px;
    padding-left: 10px;
    padding-top: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
  }
`;

export default Login;
