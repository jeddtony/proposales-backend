import { NextFunction, Request, Response } from 'express';
import { CreateOrderDto } from '@dtos/order.dto';
import { Order } from '@interfaces/order.interface';
import OrderService from '@services/orderService.service';

export class OrderController {
  public orderService = new OrderService();

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const orderData: CreateOrderDto = req.body;
      const createOrderData: Order = await this.orderService.createOrder({
        ...orderData,
        user_id: userId,
        order_date: new Date(),
      });
      res.status(201).json({ data: createOrderData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const orderHistory: Order[] = await this.orderService.getOrderHistory(userId);
      res.status(200).json({ data: orderHistory, message: 'Order history retrieved' });
    } catch (error) {
      next(error);
    }
  };

  public markOrderAsPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const orderId = Number(req.params.id);

      if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }

      const updatedOrder: Order = await this.orderService.markOrderAsPaid(orderId, userId);
      res.status(200).json({ data: updatedOrder, message: 'Order marked as paid successfully' });
    } catch (error) {
      next(error);
    }
  };
}
