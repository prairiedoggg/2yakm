export interface Review {
  reviewid?: number;
  drugid: number;
  email: string;
  content: string;
  created_at?: Date;
}
