import { ShoppingCart } from '@interfaces/shoppingCart.interface';
import { AddBookToShoppingCartDto, CreateShoppingCartDto } from '@dtos/shoppingCart.dto';
import { DB } from '@database';

class ShoppingCartService {
  public shoppingCart = DB.ShoppingCart;
  public shoppingCartItems = DB.ShoppingCartItems;

  public async getShoppingCart(userId: number): Promise<ShoppingCart> {
    const shoppingCart = await this.shoppingCart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: this.shoppingCartItems,
          as: 'items',
        },
      ],
    });
    return shoppingCart;
  }

  public async addBookToShoppingCart(shoppingCartData: AddBookToShoppingCartDto): Promise<ShoppingCart> {
    // Check if book exists and is available
    const book = await DB.Books.findByPk(shoppingCartData.book_id);
    if (!book) {
      throw new Error(`Book with ID ${shoppingCartData.book_id} not found`);
    }

    if (!book.is_available) {
      throw new Error(`Book "${book.title}" is not available for purchase`);
    }

    if (book.stock_quantity <= 0) {
      throw new Error(`Book "${book.title}" is out of stock`);
    }

    // Check if user has a shopping cart
    let userCart = await this.shoppingCart.findOne({
      where: { user_id: shoppingCartData.user_id },
    });

    // If no cart exists, create one
    if (!userCart) {
      userCart = await this.shoppingCart.create({ user_id: shoppingCartData.user_id });
    }

    // Check if book is already in the cart
    const existingCartItem = await this.shoppingCartItems.findOne({
      where: {
        shopping_cart_id: userCart.id,
        book_id: shoppingCartData.book_id,
      },
    });

    if (existingCartItem) {
      throw new Error(`Book "${book.title}" is already in your shopping cart`);
    }

    // Add book to shopping cart
    await this.shoppingCartItems.create({
      shopping_cart_id: userCart.id,
      book_id: shoppingCartData.book_id,
      quantity: 1,
    });

    return userCart;
  }
}

export default ShoppingCartService;
