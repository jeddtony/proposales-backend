import { Book } from '@interfaces/books.interface';

export interface ShoppingCartItems {
  id: number;
  shopping_cart_id: number;
  book_id: number;
  quantity: number;
  book?: Book;
  createdAt?: Date;
  updatedAt?: Date;
}
