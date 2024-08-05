import styled from 'styled-components';
import { useSearchStore } from '../../store/search';

const AutoComplete = () => {
  const { suggestions, setSearchQuery, setSuggestions } = useSearchStore();

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <AutoCompleteContainer>
      <p>자동완성 페이지</p>
      {suggestions.map((suggestion) => {
        const { name, id } = suggestion;

        return (
          <AutoCompleteItem
            key={id}
            onClick={() => handleSelectSuggestion(name)}
          >
            {name}
          </AutoCompleteItem>
        );
      })}
    </AutoCompleteContainer>
  );
};

export default AutoComplete;

const AutoCompleteContainer = styled.div``;

const AutoCompleteItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;
