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
import {  useEffect, useState } from 'react';


const BottomPictureSheet = ({ title, isVisible, onClose } : {title:string, isVisible:boolean, onClose:()=>void}) => {

  return (
    <Overlay isVisible={isVisible} onClick={onClose}>
        <SheetContainer isVisible={isVisible}>
        <Icon className='topClose' onClick={onClose} icon="material-symbols:close" width="1.7rem" height="1.7rem"  style={{color: "black"}} />
            <div className='title'>{title}</div>
            <div className='menu'><Icon icon="ph:camera-light" width="1.5rem" height="1.5rem"  style={{color: "black"}} onClick={()=>{}} /> 카메라로 촬영하기</div>
            <div className='menu'><Icon icon="solar:gallery-bold" width="1.5rem" height="1.5rem"  style={{color: "black"}} onClick={()=>{}} /> 앨범에서 선택하기</div>
            <button className='bottomClose'>닫기</button>
        </SheetContainer>
    </Overlay>
  );
};



const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  z-index: 999;
`;

const SheetContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 80%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  transform: translateY(${({ isVisible }) => (isVisible ? '0' : '100%')});
  transition: transform 0.3s ease;
  padding: 20px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  font-size:1.1em;
  gap:20px;

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
    font-size:1em;
    font-weight:bold;
    padding:5px;
    background-color:white;
    border: 1px solid #ccc;
    border-radius: 5px; 
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
