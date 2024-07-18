export interface Review {
  reviewId: number;
  drugId: number;
  reviewerId: number;
  reviewerRole: string;
  content: string;
  created_at: Date;
}
