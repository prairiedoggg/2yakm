export interface Review {
  reviewid?: number;
  drugid: number;
  userid: string;
  content: string;
  created_at?: Date;
}
