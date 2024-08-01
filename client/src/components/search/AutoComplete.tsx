import styled from 'styled-components';
import { useSearchStore } from '../../store/search';

const AutoComplete = () => {
  const { suggestions, setSearchQuery, setSuggestions } = useSearchStore();

  const handleSelectSuggestion = (suggestion: string) => {
    console.log('자동완성페이지:',suggestion)
    setSearchQuery(suggestion);
    setSuggestions([]);
  };
  
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
`;

const AutoCompleteItem = styled.div`
  padding: 10px;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;
