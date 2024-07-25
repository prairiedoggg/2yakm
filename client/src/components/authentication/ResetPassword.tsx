/**
File Name : Login
Description : 로그인
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useState } from 'react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('비번찾기');
    navigate(-1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  return (
    <Overlay>
      <Icon
        className='topClose'
        onClick={() => {
          navigate(-1);
        }}
        icon='material-symbols:close'
        width='1.7rem'
        height='1.7rem'
        style={{ color: 'black' }}
      />

      <Content>
        <Logo src='/img/logo_not_chicken.svg' alt='이약뭐약' />
        <div className='title'>
          비밀번호를 찾기위해 <br /> 가입하신 이메일 주소를 입력해주세요.
        </div>
        <form onSubmit={handleSubmit}>
          <div className='login-inputs'>
            <div className='input-container'>
              <input
                type='email'
                name='email'
                placeholder='이메일 주소'
                value={email}
                onChange={handleChange}
                required
              />
              <Icon
                className='input-left-btn'
                icon='pajamas:clear'
                width='1rem'
                height='1rem'
                style={{
                  color: 'gray',
                  display: email.trim().length > 0 ? '' : 'none'
                }}
                onClick={() => setEmail('')}
              />
            </div>
          </div>

          <button
            className='submitButton'
            disabled={!(email.trim().length > 0)}
            type='submit'
          >
            다음
          </button>
        </form>
      </Content>
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

const Logo = styled.img`
  height: 80px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  height:100%;
  margin-top:100px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap:20px;
  width:100%;

  .title{
    margin-bottom: 50px;
    text-align: center;
    font-weight:500;
  }
  
  .other{
    display:flex;
    gap:20px;
    align-items: center;
    margin-bottom:30px;
    text-decoration: underline;
    font-size:.9em;
  }

  form{
  width:80%;}

  .input-container {
    position: relative;

  }

  input{
    width: 100%;
    border: none; 
    border-radius: 4px; 
    padding:8px 3px 8px 3px;
    padding-right: 30px;
    box-sizing: border-box;
  }    

  .password{
    padding-right: 60px;
  }

  .input-left-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }    

  .input-left-second {
    right: 35px;
  }   

  .login-inputs{
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px; 
    padding: 10px 3px 10px 3px; 
    margin-bottom:20px;
  }

  .submitButton{
    position: absolute;
    bottom: 0;
    left:0;
    width:100%;
    background-color: #FDE72E;
    border: none; 
    padding:12px;
    font-size:1em;
    font-weight:bold;
}

.submitButton:disabled{
  background-color: #C7C7C7;
}
}`;

export default ResetPassword;