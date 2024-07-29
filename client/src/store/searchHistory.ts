import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface SearchHistoryState {
  history: string[];
  addHistory: (query: string) => void;
  clearHistory: () => void;
}

type MyPersist = (
  config: StateCreator<SearchHistoryState>,
  options: PersistOptions<SearchHistoryState>
) => StateCreator<SearchHistoryState>;

const useSearchHistoryStore = create<SearchHistoryState>(
  (persist as MyPersist)(
    (set, get) => ({
      history: [],
      addHistory: (query) => {
        const currentHistory = get().history;
        if (!currentHistory.includes(query)) {
          const updatedHistory = [...currentHistory, query];
          set({ history: updatedHistory });
        }
      },
      clearHistory: () => set({ history: [] })
    }),
<<<<<<< HEAD
    {
      name: 'searchHistory',
      getStorage: () => localStorage
    }
  )
);
=======
  clearHistory: () => {
    localStorage.removeItem('searchHistory');
    return set({ history: [] });
  },
  setHistory: (history) => set({ history })
}));
>>>>>>> 2963eba (d)

export { useSearchHistoryStore };
