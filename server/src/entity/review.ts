export interface Review {
  reviewId?: number;
  drugId: number;
  drugName: string;
  userId: number;
  role: string;
  content: string;
  created_at?: Date;
}
