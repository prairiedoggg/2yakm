import styled from 'styled-components';
import { usePillStore }  from '../../store/pill'


const PillExp = () => {
  const { pillData } = usePillData();

    if (!pillData) {
      return <div>약 정보를 불러오는 중입니다...</div>;
    }

  return (
    <PillExpContainer>
      <PillExpBox>
        <ul>
          <li>
            <ListTitle>
              <img src={`/img/pillexp/pill.svg`} alt='약' />
              <span
                style={{
                  fontWeight: '500'
                }}
              >
                성분
              </span>
            </ListTitle>
            <p>{pillData.ingredientname}</p>
          </li>
          <li>
            <ListTitle>
              <img src={`/img/pillexp/star.svg`} alt='별모양' />
              <span
                style={{
                  fontWeight: '500'
                }}
              >
                효과 및 효능
              </span>
            </ListTitle>
            <p>{pillData.efficacy}</p>
          </li>
          <li>
            <ListTitle>
              <img src={`/img/pillexp/pregnant.svg`} alt='임산부' />
              <span>임산부도 안전하게 복용 가능해요.</span>
            </ListTitle>
            <p className='last'>{pillData.caution}</p>
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