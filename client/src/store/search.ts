import create from 'zustand';

interface SearchState {
  searchQuery: string;
  searchType: string;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  searchType: 'name',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchType: (type) => set({ searchType: type })
}));
