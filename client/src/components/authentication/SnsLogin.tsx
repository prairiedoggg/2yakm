/**
File Name : SnsLogin
Description : sns 로그인
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { KAKAO_AUTH_URL, GOOGLE_AUTH_URL, NAVER_AUTH_URL } from '../../oAuth';

const SnsLogin = ({
  onClose,
  onEmailLoginClick,
  onEmailRegisterClick
}: {
  onClose: () => void;
  onEmailLoginClick: () => void;
  onEmailRegisterClick: () => void;
}) => {
  return (
    <Content>
      <Logo src='/img/logo_not_chicken.svg' alt='이약뭐약' />
      <div className='bubble'>⚡ 3초만에 빠른 회원가입</div>
      <a className='login kakao' onClick={onClose} href={KAKAO_AUTH_URL}>
        <div className='snsBox'>
          <Icon
            icon='ri:kakao-talk-fill'
            width='1.5rem'
            height='1.5rem'
            style={{ color: '#3A1D1F', marginRight: '10px' }}
          />
          카카오톡 로그인
        </div>
      </a>
      <a className='login naver' onClick={onClose} href={NAVER_AUTH_URL}>
        <div className='snsBox'>
          <Icon
            icon='simple-icons:naver'
            width='1rem'
            height='1rem'
            style={{ color: 'white', marginRight: '10px', padding: '5px' }}
          />
          네이버 로그인
        </div>
      </a>
      <a className='login google' onClick={onClose} href={GOOGLE_AUTH_URL}>
        <div className='snsBox'>
          <Icon
            onClick={onClose}
            icon='logos:google-icon'
            width='1.4rem'
            height='1.4rem'
            style={{ marginRight: '10px', padding: '2px' }}
          />
          구글 로그인
        </div>
      </a>
      <div className='other'>
        <div onClick={onEmailLoginClick}>이메일로 로그인</div>
        <div onClick={onEmailRegisterClick}>이메일로 회원가입</div>
      </div>
    </Content>
  );
};

const Logo = styled.img`
  height: 80px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 10px;

  .bubble {
    position: relative;
    box-shadow: 0px 4px 5px 1px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    padding: 10px 20px 10px 20px;
    font-size: 0.8em;
    font-weight: bold;
    margin-bottom: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .bubble::after {
    content: '';
    position: absolute;
    bottom: -15px; /* Adjusted position */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: 8px solid transparent; /* Reduced size */
    border-top-color: white;
  }

  .login {
    padding: 10px;
    width: 80%;
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
    align-items: center;
    display: flex;
    justify-content: center;
    text-decoration: none;
  }

  .login.kakao {
    background-color: #fae100;
    color: #2f3438;
  }

  .snsBox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .login.naver {
    background-color: #00c73c;
    color: white;
  }

  .login.google {
    background-color: #f2f2f2;
    color: #2f3438;
  }

  .other {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 80px;
    text-decoration: underline;
    font-size: 0.9em;
  }
`;

export default SnsLogin;
