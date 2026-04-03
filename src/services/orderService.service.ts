import { Order, OrderStatus } from '@interfaces/order.interface';
import { DB } from '@database';
import { CreateOrderDto } from '@dtos/order.dto';
import { TransactionStatus } from '@interfaces/transaction.interface';

class OrderService {
  public order = DB.Order;
  public orderItems = DB.OrderItems;
  public shoppingCart = DB.ShoppingCart;
  public shoppingCartItems = DB.ShoppingCartItems;

  /**
   * Creates a new order from the user's shopping cart
   * @returns {Promise<Order>} The created order
   */
  public async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const transaction = await DB.sequelize.transaction();

    try {
      const shoppingCart = await this.getShoppingCart(orderData.user_id);
      const cartItems = await this.getCartItems(shoppingCart.id);

      await this.checkAndLockInventory(cartItems, transaction);

      const order = await this.createOrderRecord(orderData, cartItems);
      await this.createOrderItems(order.id, cartItems, transaction);
      await this.updateBookInventory(cartItems, transaction);
      await this.clearShoppingCart(shoppingCart.id);

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Gets the shopping cart for a user
   * @returns {Promise<any>} The shopping cart record
   */
  private async getShoppingCart(userId: number): Promise<any> {
    const shoppingCart = await this.shoppingCart.findOne({ where: { user_id: userId } });
    if (!shoppingCart) {
      throw new Error('Shopping cart not found');
    }
    return shoppingCart;
  }

  /**
   * Gets all items in a shopping cart
   * @returns {Promise<any[]>} Array of cart items with associated book data
   */
  private async getCartItems(cartId: number): Promise<any[]> {
    const cartItems = await this.shoppingCartItems.findAll({
      where: { shopping_cart_id: cartId },
      include: [{ model: DB.Books, as: 'book' }],
    });

    if (cartItems.length === 0) {
      throw new Error('Shopping cart items not found');
    }
    return cartItems;
  }

  /**
   * Creates the order record
   * @returns {Promise<Order>} The created order record
   */
  private async createOrderRecord(orderData: CreateOrderDto, cartItems: any[]): Promise<Order> {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
    return await this.order.create({
      ...orderData,
      total_amount: totalAmount,
    });
  }

  /**
   * Creates order items records
   * @returns {Promise<void>}
   */
  private async createOrderItems(orderId: number, cartItems: any[], transaction: any): Promise<void> {
    const orderItems = cartItems.map(item => ({
      order_id: orderId,
      book_id: item.book_id,
      quantity: item.quantity,
      price_at_purchase: item.book.price,
    }));

    await this.orderItems.bulkCreate(orderItems, { transaction });
  }

  /**
   * Clears the shopping items
   * @returns {Promise<void>}
   */
  private async clearShoppingCart(cartId: number): Promise<void> {
    await this.shoppingCartItems.destroy({ where: { shopping_cart_id: cartId } });
  }

  /**
   * Checks inventory availability and locks books for update using pessimistic locking
   * @param {any[]} cartItems
   * @param {any} transaction
   * @returns {Promise<void>}
   */
  private async checkAndLockInventory(cartItems: any[], transaction: any): Promise<void> {
    for (const item of cartItems) {
      const book = await DB.Books.findByPk(item.book_id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!book) {
        throw new Error(`Book with ID ${item.book_id} not found`);
      }

      if (book.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for book "${book.title}". Available: ${book.stock_quantity}, Requested: ${item.quantity}`);
      }
    }
  }

  /**
   * Updates book inventory by decrementing quantities
   * @param {any[]} cartItems
   * @param {any} transaction
   * @returns {Promise<void>}
   */
  private async updateBookInventory(cartItems: any[], transaction: any): Promise<void> {
    for (const item of cartItems) {
      await DB.Books.decrement('stock_quantity', {
        by: item.quantity,
        where: { id: item.book_id },
        transaction,
      });
    }
  }

  /**
   * Gets order history for a user
   * @param {number} userId
   * @returns {Promise<Order[]>}
   */
  public async getOrderHistory(userId: number): Promise<Order[]> {
    const orders = await this.order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: this.orderItems,
          as: 'items',
          include: [
            {
              model: DB.Books,
              as: 'book',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return orders;
  }

  /**
   * Marks an order as paid and creates a transaction record
   * @param {number} orderId
   * @param {number} userId
   * @returns {Promise<Order>}
   */
  public async markOrderAsPaid(orderId: number, userId: number): Promise<Order> {
    const transaction = await DB.sequelize.transaction();

    try {
      const order = await this.order.findOne({
        where: { id: orderId, user_id: userId },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === OrderStatus.PAID) {
        throw new Error('Order is already marked as paid');
      }

      await this.order.update({ status: OrderStatus.PAID }, { where: { id: orderId }, transaction });

      const referenceId = `TXN-${Date.now()}-${orderId}`;
      await DB.Transaction.create(
        {
          user_id: userId,
          order_id: orderId,
          reference_id: referenceId,
          amount: order.total_amount,
          status: TransactionStatus.SUCCESSFUL,
        },
        { transaction },
      );

      await transaction.commit();

      return await this.order.findByPk(orderId, {
        include: [
          {
            model: this.orderItems,
            as: 'items',
            include: [
              {
                model: DB.Books,
                as: 'book',
              },
            ],
          },
          {
            model: DB.Transaction,
            as: 'transaction',
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default OrderService;
