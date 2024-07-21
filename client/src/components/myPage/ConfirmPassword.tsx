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
import { useNavigate } from 'react-router-dom';

const ConfirmPassword = ({ onEdit }: { onEdit: () => void }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='title'>
          안전한 변경을 위해 현재 비밀번호를 입력해 주세요
        </div>
        <div className='input-container'>
          <input
            type='password'
            value={password}
            onChange={handleChange}
            placeholder='현재 비밀번호'
          />
          <div
            className='find-password'
            onClick={() => navigate('/password/reset')}
          >
            비밀번호 찾기
          </div>
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
        <button
          className='submitButton'
          disabled={!(password.trim().length > 0)}
          onClick={onEdit}
        >
          다음
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

  .find-password {
    font-size: 0.9em;
    text-decoration: underline;
    margin-top: 10px;
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
    transform: translateY(-150%);
    cursor: pointer;
  }
`;

export default ConfirmPassword;
