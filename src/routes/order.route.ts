import { Router } from 'express';
import { OrderController } from '@controllers/order.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public order = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware, this.order.createOrder);
    this.router.get(`${this.path}/history`, AuthMiddleware, this.order.getOrderHistory);
    this.router.patch(`${this.path}/:id/pay`, AuthMiddleware, this.order.markOrderAsPaid);
  }
}
