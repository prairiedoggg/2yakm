import styled from 'styled-components';


const Tag = styled.div`
  display: flex;
  width: 100%;
  height: 30px;

  & p {
    width: 48px;
    height: 25px;
    margin-right: 10px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    line-height: 25px;
    border-radius: 5px;
    background-color: var(--main-color);
    cursor: pointer;
  }
`;

export default Tag;
