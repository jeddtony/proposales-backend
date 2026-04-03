export interface OrderItems {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price_at_purchase: number;
  created_at?: Date;
  updated_at?: Date;
}