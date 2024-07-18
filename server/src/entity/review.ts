export interface Review {
  reviewid?: number;
  drugid: number;
  drugname: string;
  userid: number;
  role: string;
  content: string;
  created_at?: Date;
}
