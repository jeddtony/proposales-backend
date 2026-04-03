export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: number;
  user_id: number;
  order_date: Date;
  total_amount: number;
  status: OrderStatus;
  created_at?: Date;
  updated_at?: Date;
}
