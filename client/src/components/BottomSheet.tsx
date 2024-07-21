/**
File Name : BottomSheet
Description : 바텀시트
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';


const BottomSheet = ({ isVisible, onClose, children } : {isVisible:boolean, onClose:()=>void, children:React.ReactNode}) => {

  return (
    <Overlay isVisible={isVisible} onClick={onClose}>
        <SheetContainer isVisible={isVisible} onClick={(e) => e.stopPropagation()}>
          <Icon className='topClose' onClick={onClose} icon="material-symbols:close" width="1.7rem" height="1.7rem"  style={{color: "black"}} />
          {children}
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

  button{
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


export default BottomSheet;
