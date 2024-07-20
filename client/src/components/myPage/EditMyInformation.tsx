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



const EditMyInformation = () => {

  return (
    <MyPageContainer>
      <StyledContent>
     
      </StyledContent>
    </MyPageContainer>
  );
};

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

    .entry{
      display: flex;
      justify-content: space-between;
      align-content: center;
      width:90%;
      margin-left:20px;
    }    
  }

`;

export default EditMyInformation;
