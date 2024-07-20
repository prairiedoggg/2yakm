/**
 * File Name : Header
 * Description : 좌측 상단의 작은 로고 구현
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.16  민선옥   Created
 * 2024.07.18  임지영   Modified    tsx
 */

import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <Link to='/'>
        <Logo src='/img/logo_not_chicken.svg' alt='이약뭐약' />
      </Link>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  background-color: #ffffff;
  padding: 15px;
  padding-bottom: 8px;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

