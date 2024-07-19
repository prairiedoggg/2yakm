/**
 * File Name : PillExp
 * Description : 약에 대한 설명
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.17  민선옥    Created
 * 2024.07.19  민선옥    tsx
 */

import React from 'react';
import styled from 'styled-components';

const PillExpContainer = styled.div`
  padding: 20px 30px 100px;

  & p.notice {
    padding: 10px 15px;
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;

    & span {
      color: #ff1f1f;
      font-size: 22px;
      font-weight: 500;
    }
  }
`;

const PillExpBox = styled.div`
  border: 1px solid #bfbfbf;
  margin: auto;
  padding: 10px 20px;
  width: 85vw;
  border-radius: 20px;

  & li {
    margin: 10px 0;
  }

  & p {
    margin: 5px 0;
  }

  & p.last {
    color: #ff0000;
    margin: 2px 0 0 30px;
    font-size: 13px;
    line-height: 18px;
  }
`;

const ListTitle = styled.div`
  display: flex;
  align-items: center;
  & span {
    margin-left: 5px;
  }
`;

const PillExp: React.FC = () => {
  return (
    <PillExpContainer>
      <PillExpBox>
        <ul>
          <li>
            <ListTitle>
              <img
                src={`/img/pillexp/pill.svg`}
                alt='ingredient'
              />
              <span
                style={{
                  fontWeight: '500'
                }}
              >
                성분
              </span>
            </ListTitle>
            <p>아세트아미노펜</p>
          </li>
          <li>
            <ListTitle>
              <img
                src={`/img/pillexp/star.svg`}
                alt='star'
              />
              <span
                style={{
                  fontWeight: '500'
                }}
              >
                효과 및 효능
              </span>
            </ListTitle>
            <p>발열, 두통, 근육통, 관절통 등</p>
          </li>
          <li>
            <ListTitle>
              <img
                src={`/img/pillexp/pregnant.svg`}
                alt='pregnant'
              />
              <span>임산부도 안전하게 복용 가능해요.</span>
            </ListTitle>
            <p className='last'>
              장기 복용시에는 자폐증 등의 위험을 높일 수 있다는 연구 결과가
              있어요. <br />
              과도한 복용은 하지 말아야 해요.
            </p>
          </li>
        </ul>
      </PillExpBox>
      <p className='notice'>
        증상이 더 악화된다면
        <br />'<span>내과, 이비인후과</span>'를 방문해
        <br />
        처방약을 복용해보세요!
      </p>
    </PillExpContainer>
  );
};

export default PillExp;
