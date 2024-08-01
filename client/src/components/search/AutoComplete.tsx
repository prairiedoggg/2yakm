import styled from 'styled-components';
import { useSearchStore } from '../../store/search';

const AutoComplete = () => {
  const { suggestions, setSearchQuery, setSuggestions } = useSearchStore();

  const handleSelectSuggestion = (suggestion: string) => {
    console.log('자동완성페이지:',suggestion)
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  if (suggestions.length === 0) {
    return <p>(자동완성)검색 결과가 없습니다</p>;
  }
  
  return (
    <AutoCompleteContainer>
      <p>자동완성 페이지</p>
      {suggestions.map((suggestion, index) => (
        <AutoCompleteItem
          key={index}
          onClick={() => handleSelectSuggestion(suggestion)}
        >
          {suggestion}
        </AutoCompleteItem>
      ))}
    </AutoCompleteContainer>
  );
};

export default AutoComplete;

const AutoCompleteContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 0 0 20px 20px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
`;

const AutoCompleteItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;
