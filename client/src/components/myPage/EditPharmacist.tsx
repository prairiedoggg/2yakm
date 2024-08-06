import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import Loading from '../Loading';
import { registCertifications } from '../../api/certificationsApi';

interface FormData {
  number: string;
  name: string;
  date: string;
}

enum InputType {
  Number = 'number',
  Name = 'name',
  Date = 'date'
}

const EditPharmacist = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    number: '',
    name: '',
    date: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'number' ? formatNumber(value) : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 3) return numericValue;

    if (numericValue.length <= 5)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;

    return `${numericValue.slice(0, 3)}-${numericValue.slice(
      3,
      5
    )}-${numericValue.slice(5, 9)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registCertifications(formData.name, formData.date, formData.number);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const clearData = (name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  };

  const getInputType = (type: InputType) => {
    switch (type) {
      case InputType.Date:
        return 'date';
      default:
        return 'text';
    }
  };

  const getValue = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return formData.name;
      case InputType.Date:
        return formData.date;
      case InputType.Number:
        return formData.number;
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const { number, name, date } = formData;
    return number !== '' && name !== '' && date !== '';
  };

  const getPlaceholder = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return '성명';
      case InputType.Date:
        return '등록일';
      case InputType.Number:
        return '등록번호';
      default:
        return '';
    }
  };

  const renderInput = (type: InputType) => {
    return (
      <div className='input-container'>
        <input
          style={{ paddingRight: '30px' }}
          type={getInputType(type)}
          name={type}
          placeholder={getPlaceholder(type)}
          value={getValue(type)}
          onChange={handleChange}
          required
        />
        <Icon
          className='input-left-btn'
          icon='pajamas:clear'
          width='1rem'
          height='1rem'
          style={{
            color: 'gray',
            display: getValue(type).trim().length > 0 ? '' : 'none'
          }}
          onClick={() => clearData(type)}
        />
      </div>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        {/* <div className='title'>
          약사 인증을 위해 사업자 등록 정보를 입력 해 주세요
        </div>
        <button
          className='submitButton'
          disabled={!isButtonEnabled}
          onClick={onEdit}
        >
          등록 완료
        </button> */}

        <form onSubmit={handleSubmit}>
          <div>
            <div className='title'>
              약사 인증을 위해 사업자 등록 정보를 입력 해 주세요
            </div>
            <div className='login-inputs'>
              {renderInput(InputType.Number)}
              {renderInput(InputType.Name)}
            </div>

            <div className='title'>개업일을 입력해주세요</div>
            <div className='login-inputs'>{renderInput(InputType.Date)}</div>
          </div>

          <button
            className='submitButton'
            disabled={!isFormValid()}
            type='submit'
          >
            변경완료
          </button>
        </form>
      </StyledContent>
      {loading && <Loading />}
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

  form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

    .input-left-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .title {
    font-weight: bold;
  }

  .login-inputs {
    width: 100%;
    padding: 10px 3px 10px 3px;
    margin-bottom: 50px;
    gap: 10px;
    display: flex;
    flex-direction: column;
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
    padding-right: 60px;
    box-sizing: border-box;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  }
`;

export default EditPharmacist;
