import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TimeChecker from './TimeChecker';

interface NavItem {
  name: string;
  label: string;
  icon: string;
  style?: React.CSSProperties;
}

const setUrl = (path: string, label: string): NavItem | null => {
  let url = '';
  switch (label) {
    case '상담':
      url =
        path === 'chatbot' ? '/img/nav/talkClicked.png' : '/img/nav/talk.png';
      return {
        name: 'chatbot',
        label: '상담',
        icon: url,
        style: { color: 'FDE72E' }
      };
    case '캘린더':
      url =
        path === 'calendar'
          ? '/img/nav/calendarClicked.png'
          : '/img/nav/calender.png';
      return {
        name: 'calendar',
        label: '캘린더',
        icon: url,
        style: { marginRight: '15px' }
      };
    case '홈':
      url = path === '' ? '/img/nav/homeClicked.png' : '/img/nav/home.png';
      return {
        name: '',
        label: '홈',
        icon: url,
        style: { position: 'absolute', top: '-20px', width: '50px' }
      };
    case '알람설정':
      url = path === 'alarm' ? '/img/nav/bellClicked.png' : '/img/nav/bell.svg';
      return {
        name: 'alarm',
        label: '알람설정',
        icon: url,
        style: { marginLeft: '10px' }
      };
    case '마이페이지':
      url =
        path === 'myPage' ? '/img/nav/userClicked.png' : '/img/nav/user.png';
      return { name: 'myPage', label: '마이페이지', icon: url };
    default:
      console.log('일치하는 라벨이 없음');
      return null;
  }
};

const navItems: string[] = ['상담', '캘린더', '홈', '알람설정', '마이페이지'];

const Nav = () => {
  const [content, setContent] = useState<NavItem[]>([]);
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    setPath(window.location.pathname.slice(1));

    const updatedContent = navItems
      .map((item) => setUrl(path, item))
      .filter(Boolean) as NavItem[];
    setContent(updatedContent);
  }, [path]);

  return (
    <NavContainer>
      <ul>
        {content.map((item) => (
          <li key={item.name} style={item.style}>
            <StyledLink to={`/${item.name}`}>
              <img src={item.icon} alt={item.label} />
              <p>{item.label}</p>
            </StyledLink>
          </li>
        ))}
      </ul>
      <TimeChecker />
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

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
