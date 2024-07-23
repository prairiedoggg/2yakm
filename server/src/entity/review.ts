export interface Review {
  reviewId?: number;
  drugId: number;
  userId: string;
  content: string;
  createdAt?: Date;
}
