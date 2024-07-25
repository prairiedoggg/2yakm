import create from 'zustand';

interface FavoriteState {
  isFavorite: boolean;
  setIsFavorite: (status: boolean) => void;
}
const useFavoriteStore = create<FavoriteState>((set) => ({
  isFavorite: false,
  setIsFavorite: (status) => set({ isFavorite: status })
}));

export { useFavoriteStore };
