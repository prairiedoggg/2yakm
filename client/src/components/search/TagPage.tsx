/**
 * File Name : TagPage
 * Description : 증상과 연관된 약 나열
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.19  민선옥    Created
 */

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import Nav from '../Nav';

const TagTitle = styled.div`
  height: 50px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  background-color: var(--main-color);
`;

const TagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();

  return (
    <>
      <Header />
      <TagTitle>{tag}</TagTitle>
      <Nav />
    </>
  );
};

export default TagPage;
