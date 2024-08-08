import { Icon } from '@iconify-icon/react';
import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import BottomSheet from '../BottomSheet';

const BottomPictureSheet = ({
  title,
  isVisible,
  onClose
}: {
  title: string;
  isVisible: boolean;
  onClose: (pic: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  console.log(navigator.userAgent);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }
      onClose(e.target.files[0]);
    },
    []
  );

  return (
    <Sheet>
      <BottomSheet isVisible={isVisible} onClose={() => onClose(null)}>
        <div className='title'>{title}</div>
        {isMobile && (
          <div className='menu'>
            <Icon
              icon='ph:camera-light'
              width='1.5rem'
              height='1.5rem'
              style={{ color: 'black' }}
              onClick={() => {}}
            />{' '}
            카메라로 촬영하기
            <input
              className='file-input'
              type='file'
              capture='environment'
              ref={inputRef}
              onChange={onUploadImage}
            />
          </div>
        )}
        <div className='menu'>
          <Icon
            icon='solar:gallery-bold'
            width='1.5rem'
            height='1.5rem'
            style={{ color: 'black' }}
          />{' '}
          앨범에서 선택하기
          <input
            className='file-input'
            type='file'
            accept='image/*'
            ref={inputRef}
            onChange={onUploadImage}
          />
        </div>

        <button className='bottomClose' onClick={() => onClose(null)}>
          닫기
        </button>
      </BottomSheet>
    </Sheet>
  );
};

const Sheet = styled.div`
  .menu {
    display: flex;
    gap: 10px;
    cursor: pointer;
  }

  .title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .bottomClose {
    margin-top: 20px;
  }

  .topClose {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
  }

  .file-input {
    position: absolute;
    background-color: red;
    opacity: 0%;
  }
`;

export default BottomPictureSheet;
