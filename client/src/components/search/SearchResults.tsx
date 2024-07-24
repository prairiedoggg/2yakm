import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PillExp from './PillExp';
import Review from './Review';

interface SearchResultsProps {
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: SearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<string>('effectiveness');
  
    const tabs = [
      { key: 'effectiveness', label: '효능•용법' },
      { key: 'review', label: '리뷰' }
    ];

  return (
    <SearchResultsContainer>
      <PillHeader>
        <img src={`/img/pill.png`} alt='pill' />
        <section>
          <PillTitle>
            <p>{searchQuery}</p>
            <h3>타이레놀정500밀리그람 (아세트아미노펜)</h3>
            <span>Tylenol Tablet 500mg</span>
            <p>한국존슨앤드존슨판매(유)</p>
          </PillTitle>
          <TagContainer>
            <Tag to='/search/tag/두통'>두통</Tag>
            <Tag to='/search/tag/신경통'>신경통</Tag>
            <Tag to='/search/tag/근육통'>근육통</Tag>
          </TagContainer>
        </section>
      </PillHeader>
      <Exp>※ 태그들을 클릭해 관련 증상들을 모아보세요.</Exp>
      <PillMore>
        <Menu>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </Menu>
        <Contants>
          {activeTab === 'effectiveness' ? <PillExp /> : <Review />}
        </Contants>
      </PillMore>
    </SearchResultsContainer>
  );
};

export default SearchResults;

const SearchResultsContainer = styled.div``;

const PillHeader = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80vw;
  margin: auto;

  & section {
    margin-left: 30px;
  }
`;

const PillTitle = styled.div`
  & p {
    padding-top: 5px;
    padding-bottom: 10px;
    font-size: 12px;
    font-weight: 300;
  }
  & span {
    color: #696969;
    font-size: 10px;
    font-style: italic;
  }
`;

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`;

const Tag = styled(Link)`
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
  text-decoration: none;
  color: black;
`;

const Exp = styled.p`
  margin: 15px 20px;
  color: #696969;
  font-size: 14px;
  text-align: end;
`;

const PillMore = styled.div`
  margin-top: 30px;
`;

const Menu = styled.div`
  display: flex;
  border-bottom: 4px solid var(--main-color);

  & button {
    flex: 1;
    margin: 0;
    padding: 10px;
    text-align: center;
    border: none;
    background: none;
    cursor: pointer;
  }

  & button.active {
    border-radius: 10px 10px 0 0;
    background-color: var(--main-color);
  }
`;

const Contants = styled.div``;