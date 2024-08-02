import create from 'zustand';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  imageQuery: File | null;
  setImageQuery: (image: File | null) => void;
  searchType: string;
  setSearchType: (type: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  imageQuery: null,
  setImageQuery: (image) => set({ imageQuery: image }),
  searchType: 'name',
  setSearchType: (type) => set({ searchType: type }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions })
}));
