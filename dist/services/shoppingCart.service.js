"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _database_1 = require("@database");
class ShoppingCartService {
    constructor() {
        this.shoppingCart = _database_1.DB.ShoppingCart;
        this.shoppingCartItems = _database_1.DB.ShoppingCartItems;
    }
    async getShoppingCart(userId) {
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
    async addBookToShoppingCart(shoppingCartData) {
        // Check if book exists and is available
        const book = await _database_1.DB.Books.findByPk(shoppingCartData.book_id);
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
exports.default = ShoppingCartService;
//# sourceMappingURL=shoppingCart.service.js.map