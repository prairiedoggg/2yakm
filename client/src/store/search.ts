import { create } from 'zustand';
import { PillData } from './pill.ts';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  imageQuery: File | null;
  setImageQuery: (image: File | null) => void;
  searchType: string;
  setSearchType: (type: string) => void;
  suggestions: PillData[];
  setSuggestions: (suggestions: PillData[]) => void;
  isSearched: boolean;
  setIsSearched: (isSearched: boolean) => void;
  isImageSearch: boolean;
  setIsImageSearch: (isImageSearch: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  imageQuery: null,
  setImageQuery: (image) => set({ imageQuery: image }),
  searchType: 'name',
  setSearchType: (type) => set({ searchType: type }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  isSearched: false,
  setIsSearched: (isSearched: boolean) => set({ isSearched }),
  isImageSearch: false,
  setIsImageSearch: (isImageSearch: boolean) => set({ isImageSearch })
}));
