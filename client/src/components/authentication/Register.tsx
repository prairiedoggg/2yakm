/**
File Name : Register
Description : 회원가입
Author : 오선아

History
Date        Author   Status    Description
2024.07.21  오선아   Created
*/

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

enum InputType {
  Name = 'name',
  Email = 'email',
  Password = 'password',
  ConfirmPassword = 'confirmPassword'
}

const Register = () => {
  const navigate = useNavigate();
  const inputKeys = Object.keys(InputType) as Array<keyof typeof InputType>;

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('회원가입');
  };

  const clearData = (name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  };

  const getPlaceholder = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return '이름';
      case InputType.Email:
        return '이메일 주소';
      case InputType.Password:
        return '비밀번호';
      case InputType.ConfirmPassword:
        return '비밀번호 확인';
    }
  };

  const getInputType = (type: InputType) => {
    switch (type) {
      case InputType.Email:
        return 'email';
      case InputType.Password:
      case InputType.ConfirmPassword:
        return showPassword ? 'text' : 'password';
      default:
        return 'text';
    }
  };

  const getValue = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return formData.name;
      case InputType.Email:
        return formData.email;
      case InputType.Password:
        return formData.password;
      case InputType.ConfirmPassword:
        return formData.confirmPassword;
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const { email, name, password, confirmPassword } = formData;
    return (
      email !== '' &&
      name !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword
    );
  };

  const renderInput = (type: InputType, showHr: boolean) => {
    return (
      <div className='input-container'>
        <input
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

        {(type === InputType.Password ||
          type === InputType.ConfirmPassword) && (
          <Icon
            className='input-left-btn input-left-second'
            icon={showPassword ? 'mdi:show' : 'mdi:hide'}
            width='1.2rem'
            height='1.2rem'
            style={{
              color: 'gray',
              display: getValue(type).trim().length > 0 ? '' : 'none'
            }}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
        {showHr && <hr />}
      </div>
    );
  };

  return (
    <Overlay>
      <Icon
        className='topClose'
        onClick={() => {
          navigate('/');
        }}
        icon='material-symbols:close'
        width='1.7rem'
        height='1.7rem'
        style={{ color: 'black' }}
      />

      <Content>
        <Logo src='/img/logo_not_chicken.svg' alt='이약뭐약' />
        <div className='title'>
          간편하게 가입하고 <br /> 다양한 서비스를 이용하세요.
        </div>
        <form onSubmit={handleSubmit}>
          <div className='login-inputs'>
            {inputKeys.map((key, index) =>
              renderInput(InputType[key], index < inputKeys.length - 1)
            )}
          </div>

          <button
            className='submitButton'
            disabled={!isFormValid()}
            type='submit'
          >
            시작하기
          </button>
        </form>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  transition: opacity 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .topClose {
    top: 10px;
    left: 10px;
    padding-left: 10px;
    padding-top: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
  }
`;

const Logo = styled.img`
  height: 80px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  height:100%;
  margin-top:100px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap:20px;
  width:100%;

  .title{
    margin-bottom: 50px;
    text-align: center;
    font-weight:500;
  }
  
  .other{
    display:flex;
    gap:20px;
    align-items: center;
    margin-bottom:30px;
    text-decoration: underline;
    font-size:.9em;
  }

  form{
  width:80%;}

  .input-container {
    position: relative;

  }

  input{
    width: 100%;
    border: none; 
    border-radius: 4px; 
    padding:8px 3px 8px 3px;
    padding-right: 30px;
    box-sizing: border-box;
  }    

  .password{
    padding-right: 60px;
  }

  .input-left-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }    

  .input-left-second {
    right: 35px;
  }   

  .login-inputs{
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px; 
    padding: 10px 3px 10px 3px; 
    margin-bottom:20px;
  }

  .submitButton{
    position: absolute;
    bottom: 0;
    left:0;
    width:100%;
    background-color: #FDE72E;
    border: none; 
    padding:12px;
    font-size:1em;
    font-weight:bold;
}

.submitButton:disabled{
  background-color: #C7C7C7;
}
}`;

export default Register;
