import { NextFunction, Request, Response } from 'express';
import { CreateShoppingCartDto, AddBookToShoppingCartDto } from '@dtos/shoppingCart.dto';
import { ShoppingCart } from '@interfaces/shoppingCart.interface';
import ShoppingCartService from '@services/shoppingCart.service';

export class ShoppingCartController {
  public shoppingCartService = new ShoppingCartService();

  public getShoppingCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const shoppingCartData: ShoppingCart = await this.shoppingCartService.getShoppingCart(userId);
      res.status(200).json({ data: shoppingCartData, message: 'List of items in shopping cart' });
    } catch (error) {
      next(error);
    }
  };

  public addBookToShoppingCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { book_id } = req.body;
      const addBookToShoppingCartData: ShoppingCart = await this.shoppingCartService.addBookToShoppingCart({ user_id: userId, book_id });
      res.status(200).json({ data: addBookToShoppingCartData, message: 'Added book to shopping cart' });
    } catch (error) {
      next(error);
    }
  };
}
