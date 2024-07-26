import styled from 'styled-components';
import BottomPictureSheet from './BottomPictureSheet';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import { logout } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

interface Info {
  info: string;
  onClick?: () => void;
}

const EditMyInformation = ({
  onEditNameClick,
  onEditPasswordClick,
  onEditPharmacistClick
}: {
  onEditNameClick: () => void;
  onEditPasswordClick: () => void;
  onEditPharmacistClick: () => void;
}) => {
  const [bottomSheet, setBottomSheet] = useState(false);
  const navigate = useNavigate();

  const infos1: Info[] = [
    { info: '이메일', onClick: undefined },
    { info: '이름', onClick: onEditNameClick },
    { info: '비밀번호 변경', onClick: onEditPasswordClick }
  ];

  const infos2: Info[] = [
    { info: '약사 인증', onClick: onEditPharmacistClick },
    { info: '연동된 소셜계정', onClick: undefined }
  ];

  const getInfoValue = (type: string) => {
    switch (type) {
      case '이름':
        return '홍길동';
      case '이메일':
        return 'gildong@naver.com';
      case '연동된 소셜계정':
        return <Icon icon='devicon:google' width='1.1rem' height='1.1rem' />;
      default:
        return '';
    }
  };

  const generateItems = (infos: Info[]) => {
    const items = [];
    for (let i = 0; i < infos.length; i++) {
      items.push(
        <div key={i}>
          <div className='information-item' onClick={infos[i].onClick}>
            <div className='info-key'>{infos[i].info}</div>
            <div className='info-value'>
              <div>{getInfoValue(infos[i].info)}</div>{' '}
              {infos[i].onClick ? (
                <Icon icon='ep:arrow-right-bold' width='1.1em' height='1.1em' />
              ) : (
                ''
              )}{' '}
            </div>
          </div>
          {i == infos.length - 1 ? '' : <hr />}
        </div>
      );
    }
    return items;
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='thumbnail'>
          <img
            className='thumbnailImage'
            src={`img/user.svg`}
            alt='프로필 이미지'
          />
          <div className='edit-thumb' onClick={() => setBottomSheet(true)}>
            <Icon icon='solar:camera-bold' width='1.2em' height='1.2em' />
          </div>
        </div>
        <div className='informations'>{generateItems(infos1)}</div>

        <div className='informations'>{generateItems(infos2)}</div>

        <div className='bottom-menu'>
          <div
            onClick={() =>
              logout(() => {
                navigate('/', { replace: true });
                window.location.reload();
              })
            }
          >
            로그아웃
          </div>{' '}
          | <div>회원탈퇴</div>
        </div>
      </StyledContent>

      <BottomPictureSheet
        title={'사진 등록'}
        isVisible={bottomSheet}
        onClose={() => {
          setBottomSheet(false);
        }}
      />
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
  align-items: center;
  gap: 50px;
  padding-top: 20px;

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

    .edit-thumb {
      display: grid;
      place-items: center;
      position: absolute;
      width: 40px;
      height: 40px;
      font-size: 1.2em;
      border-radius: 50%;
      background-color: #ccc;
      right: 0;
      bottom: 0;
      border: 3px solid white;
    }
  }

  .informations {
    width: 90%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;

    .information-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 30px;
      place-items: center;

      .info-key {
        font-size: 1.1em;
        font-weight: 500;
      }

      .info-value {
        display: flex;
        gap: 10px;
        font-align: right;
        color: gray;
      }
    }

    .information-item:hover {
      cursor: pointer;
    }
  }

  .bottom-menu {
    color: gray;
    margin-top: 50px;
    display: flex;
    gap: 10px;
  }
`;

export default EditMyInformation;
