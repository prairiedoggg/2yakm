/**
File Name : Nav
Description : 하단 네브게이션바
Author : 민선옥

History
Date        Author   Status    Description
2024.07.16  민선옥   Created
2024.07.17  민선옥   Modified   알람설정 추가
2024.07.18  임지영   Modified   tsx
2024.07.22  임지영   Modified    + ChatBot
*/

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = () => {
  const navigate = useNavigate();

  const handleNav = (nav: string) => () => {
    switch (nav) {
      case 'chatbot':
        return navigate('/chatbot');
      case 'calendar':
        return navigate('/calendar');
      case 'home':
        return navigate('/');
      case 'alarm':
        return navigate('/alarm');
      case 'myPage':
        return navigate('/myPage');
    }
  };

  return (
    <NavContainer>
      <ul>
        <li onClick={handleNav('chatbot')}>
          <img src={`/img/nav/talk.png`} alt='상담' style={{ width: '40px' }} />
          <p>상담</p>
        </li>
        <li style={{ marginRight: '15px' }} onClick={handleNav('calendar')}>
          <img src={`/img/nav/calender.png`} alt='캘린더' />
          <p>캘린더</p>
        </li>
        <li onClick={handleNav('home')}>
          <img
            src={`/img/nav/home.png`}
            alt='홈'
            style={{ position: 'absolute', top: '-20px', width: '50px' }}
          />
        </li>
        <li style={{ marginLeft: '15px' }} onClick={handleNav('alarm')}>
          <img src={`/img/nav/bell.svg`} alt='알람' style={{ width: '30px' }} />
          <p>알람설정</p>
        </li>
        <li onClick={handleNav('myPage')}>
          <img src={`/img/nav/user.png`} alt='유저' style={{ width: '30px' }} />
          <p>마이페이지</p>
        </li>
      </ul>
    </NavContainer>
  );
};

export default Nav;

const NavContainer = styled.nav`
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 100vw;
  height: 80px;
  background-color: #ffffff;
  & ul {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: auto;
    padding: 0;
    height: 100%;
    & li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      list-style: none;

      &:hover {
        cursor: pointer;
        & img {
          filter: var(--main-color);
        }
        & p {
          color: var(--main-color);
        }
      }
    }
    & img {
      width: 35px;
    }
    & p {
      margin: 0;
      color: #c6c6c6;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;
