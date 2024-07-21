/**
File Name : Register
Description : 회원가입
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify-icon/react';

const Register = () => {
  const navigate = useNavigate();

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
      회원가입
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

export default Register;
