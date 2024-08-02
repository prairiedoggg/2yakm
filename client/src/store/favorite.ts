import create from 'zustand';

interface FavoriteState {
  isFavorite: boolean;
  setIsFavorite: (status: boolean) => void;
  favoriteCount: number;
  setFavoriteCount: (count: number) => void;
}
const useFavoriteStore = create<FavoriteState>((set) => ({
  isFavorite: false,
  setIsFavorite: (status) => set({ isFavorite: status }),
  favoriteCount: 0,
  setFavoriteCount: (count) => set({ favoriteCount: count })
}));

export { useFavoriteStore };
