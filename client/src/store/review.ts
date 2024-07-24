import create from 'zustand';

interface ReviewState {
  isWritingReview: boolean;
  toggleReviewForm: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  isWritingReview: false,
  toggleReviewForm: () =>
    set((state) => ({ isWritingReview: !state.isWritingReview }))
}));
