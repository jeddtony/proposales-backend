export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  is_available: boolean;
  price: number;
  stock_quantity: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}