export type Gift = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type Reservation = {
  id: number;
  gift_id: string;
  reserved_by: string;
  message: string | null;
  created_at: string;
};
