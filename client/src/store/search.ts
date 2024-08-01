import create from 'zustand';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: string;
  setSearchType: (type: string) => void;
  suggestions: string[];
  setSuggestions:(suggestions:string[])=>void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchType: 'name',
  setSearchType: (type) => set({ searchType: type }),
  suggestions: [],
  setSuggestions: (suggestions) => set({suggestions}),
}));
