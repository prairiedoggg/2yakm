import create from 'zustand';

interface ReviewState {
  reviewCount: number;
  setReviewCount: (count: number) => void;
}

const useReviewStore = create<ReviewState>((set) => ({
  reviewCount: 0,
  setReviewCount: (count) => set({ reviewCount: count })
}));

export { useReviewStore };
