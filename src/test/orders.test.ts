import { getMockedDB } from './utils/test-db-mock';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import { CreateOrderDto } from '@dtos/order.dto';
import { OrderRoute } from '@routes/order.route';
import { TestServer } from './utils/test-server';
import { OrderStatus } from '@interfaces/order.interface';
import { TransactionStatus } from '@interfaces/transaction.interface';

// Mock the auth middleware to always pass
jest.mock('@middlewares/auth.middleware', () => ({
  AuthMiddleware: (req: any, res: any, next: any) => {
    // Mock user data
    (req as any).user = { id: 1 };
    next();
  },
}));

let testServer: TestServer;

beforeAll(async () => {
  testServer = new TestServer([new OrderRoute()]);
  await testServer.start();
});

afterAll(async () => {
  if (testServer) {
    await testServer.stop();
  }
});

describe('Testing Orders', () => {
  describe('[POST] /order', () => {
    it('response create order successfully', async () => {
      const orderData: CreateOrderDto = {
        user_id: 1,
        order_date: new Date(),
      };

      const DB = getMockedDB();

      // Mock shopping cart
      DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock cart items with book data
      DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          shopping_cart_id: 1,
          book_id: 1,
          quantity: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          book: {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            price: 1500,
            stock_quantity: 10,
          },
        },
        {
          id: 2,
          shopping_cart_id: 1,
          book_id: 2,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          book: {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            price: 1200,
            stock_quantity: 5,
          },
        },
      ]);

      // Mock book inventory checks
      DB.Books.findByPk = jest.fn().mockImplementation((id) => {
        const books = {
          1: { id: 1, title: 'The Great Gatsby', stock_quantity: 10 },
          2: { id: 2, title: 'To Kill a Mockingbird', stock_quantity: 5 },
        };
        return books[id];
      });

      // Mock order creation
      DB.Order.create = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        order_date: new Date(),
        total_amount: 4200, // (1500 * 2) + (1200 * 1)
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock order items creation
      DB.OrderItems.bulkCreate = jest.fn().mockResolvedValue([
        {
          id: 1,
          order_id: 1,
          book_id: 1,
          quantity: 2,
          price_at_purchase: 1500,
        },
        {
          id: 2,
          order_id: 1,
          book_id: 2,
          quantity: 1,
          price_at_purchase: 1200,
        },
      ]);

      // Mock book inventory updates
      DB.Books.decrement = jest.fn().mockResolvedValue(1);

      // Mock cart clearing
      DB.ShoppingCartItems.destroy = jest.fn().mockResolvedValue(2);

      // Mock transaction
      DB.sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: { UPDATE: 'UPDATE' },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      });

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .post('/order')
        .send(orderData)
        .expect(201);
    });

    it('response error - shopping cart not found', async () => {
      const orderData: CreateOrderDto = {
        user_id: 1,
        order_date: new Date(),
      };

      const DB = getMockedDB();

      // Mock no shopping cart found
      DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .post('/order')
        .send(orderData)
        .expect(500);
    });

    it('response error - shopping cart is empty', async () => {
      const orderData: CreateOrderDto = {
        user_id: 1,
        order_date: new Date(),
      };

      const DB = getMockedDB();

      // Mock shopping cart exists
      DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock empty cart items
      DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([]);

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .post('/order')
        .send(orderData)
        .expect(500);
    });

    it('response error - insufficient stock', async () => {
      const orderData: CreateOrderDto = {
        user_id: 1,
        order_date: new Date(),
      };

      const DB = getMockedDB();

      // Mock shopping cart
      DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock cart items with book data
      DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          shopping_cart_id: 1,
          book_id: 1,
          quantity: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          book: {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            price: 1500,
            stock_quantity: 10,
          },
        },
      ]);

      // Mock book with insufficient stock
      DB.Books.findByPk = jest.fn().mockReturnValue({
        id: 1,
        title: 'The Great Gatsby',
        stock_quantity: 2, // Less than requested quantity (5)
      });

      // Mock transaction
      DB.sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: { UPDATE: 'UPDATE' },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      });

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .post('/order')
        .send(orderData)
        .expect(500);
    });
  });

  describe('[GET] /order/history', () => {
    it('response get order history successfully', async () => {
      const DB = getMockedDB();

      // Mock order history with items and books
      DB.Order.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          user_id: 1,
          order_date: new Date(),
          total_amount: 4200,
          status: OrderStatus.PAID,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [
            {
              id: 1,
              order_id: 1,
              book_id: 1,
              quantity: 2,
              price_at_purchase: 1500,
              book: {
                id: 1,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                price: 1500,
              },
            },
            {
              id: 2,
              order_id: 1,
              book_id: 2,
              quantity: 1,
              price_at_purchase: 1200,
              book: {
                id: 2,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 1200,
              },
            },
          ],
        },
        {
          id: 2,
          user_id: 1,
          order_date: new Date(),
          total_amount: 1800,
          status: OrderStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [
            {
              id: 3,
              order_id: 2,
              book_id: 3,
              quantity: 1,
              price_at_purchase: 1800,
              book: {
                id: 3,
                title: '1984',
                author: 'George Orwell',
                price: 1800,
              },
            },
          ],
        },
      ]);

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .get('/order/history')
        .expect(200);
    });

    it('response get empty order history', async () => {
      const DB = getMockedDB();

      // Mock empty order history
      DB.Order.findAll = jest.fn().mockReturnValue([]);

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .get('/order/history')
        .expect(200);
    });
  });

  describe('[PATCH] /order/:id/pay', () => {
    it('response mark order as paid successfully', async () => {
      const orderId = 1;
      const DB = getMockedDB();

      // Mock order exists and is pending
      DB.Order.findOne = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        order_date: new Date(),
        total_amount: 4200,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock order update
      DB.Order.update = jest.fn().mockResolvedValue([1]);

      // Mock transaction creation
      DB.Transaction.create = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        order_id: 1,
        reference_id: 'TXN-1234567890-1',
        amount: 4200,
        status: TransactionStatus.SUCCESSFUL,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock updated order with items and transaction
      DB.Order.findByPk = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        order_date: new Date(),
        total_amount: 4200,
        status: OrderStatus.PAID,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            order_id: 1,
            book_id: 1,
            quantity: 2,
            price_at_purchase: 1500,
            book: {
              id: 1,
              title: 'The Great Gatsby',
              author: 'F. Scott Fitzgerald',
            },
          },
        ],
        transaction: {
          id: 1,
          user_id: 1,
          order_id: 1,
          reference_id: 'TXN-1234567890-1',
          amount: 4200,
          status: TransactionStatus.SUCCESSFUL,
        },
      });

      // Mock transaction
      DB.sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: { UPDATE: 'UPDATE' },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      });

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .patch(`/order/${orderId}/pay`)
        .expect(200);
    });

    it('response error - order not found', async () => {
      const orderId = 999;
      const DB = getMockedDB();

      // Mock order not found
      DB.Order.findOne = jest.fn().mockReturnValue(null);

      // Mock transaction
      DB.sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: { UPDATE: 'UPDATE' },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      });

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .patch(`/order/${orderId}/pay`)
        .expect(500);
    });

    it('response error - order already paid', async () => {
      const orderId = 1;
      const DB = getMockedDB();

      // Mock order already paid
      DB.Order.findOne = jest.fn().mockReturnValue({
        id: 1,
        user_id: 1,
        order_date: new Date(),
        total_amount: 4200,
        status: OrderStatus.PAID, // Already paid
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock transaction
      DB.sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
          LOCK: { UPDATE: 'UPDATE' },
        };

        if (callback) {
          await callback(mockTransaction);
        }

        return mockTransaction;
      });

      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .patch(`/order/${orderId}/pay`)
        .expect(500);
    });

    it('response error - invalid order ID', async () => {
      (Sequelize as any).authenticate = jest.fn();
      return request(testServer.getServer())
        .patch('/order/invalid/pay')
        .expect(400);
    });
  });
}); 