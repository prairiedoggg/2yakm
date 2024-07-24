
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface NavItem {
  name: string;
  label: string;
  icon: string;
  style?: React.CSSProperties;
}

const navItems: NavItem[] = [
  { name: 'chatbot', label: '상담', icon: '/img/nav/talk.png' },
  {
    name: 'calendar',
    label: '캘린더',
    icon: '/img/nav/calender.png',
    style: { marginRight: '15px' }
  },
  {
    name: '',
    label: '홈',
    icon: '/img/nav/home.png',
    style: { position: 'absolute', top: '-20px', width: '50px' }
  },
  {
    name: 'alarm',
    label: '알람설정',
    icon: '/img/nav/bell.svg',
    style: { marginLeft: '10px' }
  },
  { name: 'myPage', label: '마이페이지', icon: '/img/nav/user.png' }
];

const Nav = () => {
  return (
    <NavContainer>
      <ul>
        {navItems.map((item) => (
          <li key={item.name} style={item.style}>
            <StyledLink to={`/${item.name}`}>
              <img src={item.icon} alt={item.label} />
              <p>{item.label}</p>
            </StyledLink>
          </li>
        ))}
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

const StyledLink = styled(Link)`
  text-decoration: none; 
  display: flex;
  flex-direction: column;
  align-items: center;
`;
