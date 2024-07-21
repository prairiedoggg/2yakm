/**
File Name : MyInformation
Description : 내 정보
Author : 오선아

History
Date        Author   Status    Description
2024.07.19  오선아   Created
*/

import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';

const MyInformation = ({
  onEditInfo: onEditClick
}: {
  onEditInfo: () => void;
}) => {
  return (
    <InformationLayout>
      <div className='thumbnail'>
        <img
          className='thumbnailImage'
          src={`img/user.svg`}
          alt='프로필 이미지'
        />
      </div>

      <div className='profile'>
        <div className='info'>
          <div className='nameArea' onClick={() => onEditClick()}>
            홍길동 <Icon icon='ic:baseline-edit' style={{ color: '#d1d1d1' }} />
          </div>
          <div>gildong@naver.com</div>
        </div>
      </div>
    </InformationLayout>
  );
};

const InformationLayout = styled.div`
  display: flex;
  margin-top: 20px;

  .profile {
    display: flex;
    display: grid;
    justify-content: center;
    align-content: center;

    .nameArea {
      display: flex;
      justify-content: left;
      align-content: center;
      gap: 10px;
    }
  }

  .thumbnail {
    position: relative;
    max-width: 200px;
    max-height: 200px;
    min-width: 100px;
    margin-right: 20px;
    margin-left: 20px;
    color: white;

    .thumbnailImage {
      width: 100%;
      height: 100%;
    }
  }

  .nameArea {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.5em;
    display: inline;
  }
`;

export default MyInformation;
