export type Gift = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type Vaquinha = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type Reservation = {
  id: number;
  gift_id: string;
  user_uid: string;
  user_email: string | null;
  reserved_by: string;
  message: string | null;
  created_at: string;
};
