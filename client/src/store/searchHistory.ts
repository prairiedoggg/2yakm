import create from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryState {
  history: string[];
  addHistory: (query: string) => void;
  clearHistory: () => void;
}

const useSearchHistoryStore = create<SearchHistoryState>(
  persist(
    (set) => ({
      history: [],
      addHistory: (query) =>
        set((state) => ({
          history: [...state.history, query]
        })),
      clearHistory: () =>
        set({
          history: []
        })
    }),
    {
      name: 'searchHistory',
      getStorage: () => localStorage 
    }
  )
);

export { useSearchHistoryStore };
