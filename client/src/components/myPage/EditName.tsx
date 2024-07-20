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
import { ChangeEvent, useEffect, useState } from 'react';



const EditName = ({onEdit}:{onEdit:()=>void}) => {
  const [name, setName] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setIsButtonEnabled(value.trim().length > 0);
  };

  useEffect(() => {
    setIsButtonEnabled(name.trim().length > 0);
    return () => {
    };
  }, [name]);  

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='title'>새로운 이름을 입력해주세요</div>
        <div className="input-container">
          <input type="text" placeholder="홍길동" value={name} onChange={handleChange} />
          <Icon className='clearButton' icon="pajamas:clear" width="1rem" height="1rem" 
                style={{color: "gray", display:isButtonEnabled? '' : 'none'}}
                onClick={()=>setName('')} />
        </div>
        <button className='submitButton' disabled={!isButtonEnabled} onClick={onEdit}>변경 완료</button>
      </StyledContent>
    </MyPageContainer>
  );
};



const MyPageContainer = styled.div`
  width: 100%;
  height:70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding:0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  gap:20px;

  .title{
    font-weight:bold;
  }

  .submitButton{
    background-color: #FDE72E;
    border: none; 
    padding:12px;
    font-size:1em;
    font-weight:bold;
    margin-top: auto;
  }

  .submitButton:disabled{
    background-color: #C7C7C7;
  }

  .input-container {
    position: relative;
  }

  input{
    width: 100%;
    background-color: #f0f0f0;
    border: none; 
    border-radius: 4px; 
    padding:12px;
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

export default EditName;
