import create from 'zustand';

interface SearchHistoryState {
  history: string[];
  addHistory: (query: string) => void;
  clearHistory: () => void;
  setHistory: (history: string[]) => void;
}

const useSearchHistoryStore = create<SearchHistoryState>((set) => ({
  history: [],
  addHistory: (query) =>
    set((state) => {
      const updatedHistory = [...state.history, query];
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return { history: updatedHistory };
    }),
  clearHistory: () => {
    localStorage.removeItem('searchHistory');
    return set({ history: [] });
  },
  setHistory: (history) => set({ history }) 
}));

export { useSearchHistoryStore };

