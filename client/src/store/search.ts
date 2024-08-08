import { create } from 'zustand';
import { PillData } from './pill.ts';

interface SearchState {
  imageQuery: File | null;
  setImageQuery: (image: File | null) => void;
  searchType: string;
  setSearchType: (type: string) => void;
  suggestions: PillData[];
  setSuggestions: (suggestions: PillData[]) => void;
  isImageSearch: boolean;
  setIsImageSearch: (isImageSearch: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  imageQuery: null,
  setImageQuery: (image) => set({ imageQuery: image }),
  searchType: 'name',
  setSearchType: (type) => set({ searchType: type }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  isImageSearch: false,
  setIsImageSearch: (isImageSearch: boolean) => set({ isImageSearch })
}));
