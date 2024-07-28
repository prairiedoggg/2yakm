import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { useEffect, useState } from 'react';
import BottomPictureSheet from './BottomPictureSheet';

const EditPharmacist = ({ onEdit }: { onEdit: () => void }) => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  useEffect(() => {
    setIsButtonEnabled(true);
    return () => {};
  }, [imageSrc]);

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='title'>
          약사 인증을 위해 사업자 등록증을 등록해주세요
        </div>
        <div className='informations'>
          <div
            className='information-item'
            onClick={() => setBottomSheet(true)}
          >
            <div className='info-key'>사업자 등록증 찾기</div>
            <div className='info-value'>
              {' '}
              <Icon
                icon='ep:arrow-right-bold'
                width='1.1em'
                height='1.1em'
              />{' '}
            </div>
          </div>

          {imageSrc && (
            <div className='selected-img'>
              <img
                src={imageSrc as string}
                alt='Selected'
                style={{ width: '100%', height: 'auto', marginTop: '20px' }}
              />
            </div>
          )}
        </div>
        <button
          className='submitButton'
          disabled={!isButtonEnabled}
          onClick={onEdit}
        >
          등록 완료
        </button>
      </StyledContent>
      <BottomPictureSheet
        title={'사업자 등록증 등록'}
        isVisible={bottomSheet}
        onClose={(pic) => {
          if (pic !== null) {
            if (pic) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageSrc(reader.result);
              };
              reader.readAsDataURL(pic);
            }
          }
          setBottomSheet(false);
        }}
      />
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

  .selected-img {
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

  .informations {
    width: 100%;
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
`;

export default EditPharmacist;
