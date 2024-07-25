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
import { ChangeEvent, useState } from 'react';

const ConfirmPassword = ({ onEdit }: { onEdit: () => void }) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword2(value);
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='title'>새로운 비밀번호를 입력해주세요</div>
        <div className='input-container'>
          <input
            type='password'
            value={password}
            onChange={handleChange}
            placeholder='새로운 비밀번호'
          />
          <Icon
            className='clearButton'
            icon='pajamas:clear'
            width='1rem'
            height='1rem'
            style={{
              color: 'gray',
              display: password.trim().length > 0 ? '' : 'none'
            }}
            onClick={() => setPassword('')}
          />
        </div>
        <div className='input-container'>
          <input
            type='password'
            value={password2}
            onChange={handleChange2}
            placeholder='비밀번호 확인'
          />
          <Icon
            className='clearButton'
            icon='pajamas:clear'
            width='1rem'
            height='1rem'
            style={{
              color: 'gray',
              display: password2.trim().length > 0 ? '' : 'none'
            }}
            onClick={() => setPassword2('')}
          />
        </div>
        <button
          className='submitButton'
          disabled={!(password.trim().length > 0) || password !== password2}
          onClick={onEdit}
        >
          변경 완료
        </button>
      </StyledContent>
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  height: 70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;

  .title {
    font-weight: bold;
  }

  .submitButton {
    background-color: #fde72e;
    border: none;
    padding: 12px;
    font-size: 1em;
    font-weight: bold;
    margin-top: auto;
  }

  .submitButton:disabled {
    background-color: #c7c7c7;
  }

  .input-container {
    position: relative;
  }

  input {
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 12px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

export default ConfirmPassword;