export interface Review {
  id?: number;
  pillId: number;
  userId: string;
  content: string;
  createdAt?: Date;
}
