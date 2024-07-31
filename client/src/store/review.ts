import create from 'zustand';

export interface Review {
  id: string;
  pillId: string;
  name?: string;
  userid: string;
  username?: string;
  role?: boolean;
  content: string;
}

interface ReviewState {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  nextCursor: number | null;
  setNextCursor: (cursor: number | null) => void;
  isWritingReview: boolean;
  toggleReviewForm: () => void;
  reviewCount: number;
  setReviewCount: (count: number) => void;
}

const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
  nextCursor: null,
  setNextCursor: (cursor) => set({ nextCursor: cursor }),
  isWritingReview: false,
  toggleReviewForm: () =>
    set((state) => ({ isWritingReview: !state.isWritingReview })),
  reviewCount: 0,
  setReviewCount: (count) => set({ reviewCount: count })
}));

export { useReviewStore };
