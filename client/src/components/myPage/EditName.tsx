import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, useState } from 'react';
import useUserStore from '../../store/user';
import { changeUserName } from '../../api/myPageService';
import PopupContent, { PopupType } from '../popup/PopupMessages';
import Popup from '../popup/Popup';
import { useNavigate } from 'react-router-dom';

const EditName = ({ onEdit }: { onEdit: () => void }) => {
  const { user } = useUserStore.getState();
  const [name, setName] = useState('');
  const [blur, setBlur] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='title'>새로운 이름을 입력해주세요 (3~20글자)</div>
        <div className='input-container'>
          <input
            type='text'
            placeholder={user?.userName ?? ''}
            value={name}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            onBlur={() => setBlur(true)}
            onFocus={() => {
              if (name.length > 2) setBlur(false);
            }}
          />
          <Icon
            className='clearButton'
            icon='pajamas:clear'
            width='1rem'
            height='1rem'
            style={{
              color: 'gray',
              display: name.trim().length > 0 ? '' : 'none'
            }}
            onClick={() => setName('')}
          />
        </div>
        <div
          style={{
            color: 'red',
            fontSize: '0.9rem',
            display: blur && name.length < 3 ? 'initial' : 'none'
          }}
        >
          <b>!</b> 이름은 3글자 이상 입력해주세요.
        </div>
        <button
          className='submitButton'
          disabled={!(name.trim().length > 2)}
          onClick={() => {
            changeUserName(
              name,
              () => {
                setPopupType(PopupType.ChangeUserNameSuccess);
              },
              () => {
                setPopupType(PopupType.ChangeUserNameFailure);
              }
            );
          }} //onEdit()
        >
          변경 완료
        </button>
      </StyledContent>

      {popupType !== PopupType.None && (
        <Popup
          onClose={() =>
            popupType == PopupType.ChangeUserNameFailure
              ? setPopupType(PopupType.None)
              : onEdit()
          }
        >
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
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
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

export default EditName;
