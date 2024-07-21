/**
File Name : BottomPictureSheet
Description : 사진 선택용 바텀시트
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import BottomSheet from '../BottomSheet';


const BottomPictureSheet = ({ title, isVisible, onClose } : {title:string, isVisible:boolean, onClose:()=>void}) => {

  return (
    <Sheet>
      <BottomSheet isVisible = {isVisible} onClose={onClose}>
        <div className='title'>{title}</div>
        <div className='menu'><Icon icon="ph:camera-light" width="1.5rem" height="1.5rem"  style={{color: "black"}} onClick={()=>{}} /> 카메라로 촬영하기</div>
        <div className='menu'><Icon icon="solar:gallery-bold" width="1.5rem" height="1.5rem"  style={{color: "black"}} onClick={()=>{}} /> 앨범에서 선택하기</div>
        <button className='bottomClose'>닫기</button>
      </BottomSheet>
    </Sheet>

  );
};

const Sheet = styled.div`
  .menu{
    display: flex;
    gap:10px;
  }

  .title{
    font-size:1.2em;
    font-weight:bold;
    margin-bottom:20px;
  }

  .bottomClose{
    margin-top:20px;
  }

  .topClose{
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
  }
`;


export default BottomPictureSheet;
