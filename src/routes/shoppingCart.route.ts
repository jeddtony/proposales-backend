import { Router } from 'express';
import { ShoppingCartController } from '@controllers/shoppingCart.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AddBookToShoppingCartRequestDto } from '@dtos/shoppingCart.dto';

export class ShoppingCartRoute implements Routes {
  public path = '/shopping-cart';
  public router = Router();
  public shoppingCart = new ShoppingCartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.shoppingCart.getShoppingCart);
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(AddBookToShoppingCartRequestDto), this.shoppingCart.addBookToShoppingCart);
  }
}
