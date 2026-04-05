"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _database = require("../database");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let ShoppingCartService = class ShoppingCartService {
    async getShoppingCart(userId) {
        const shoppingCart = await this.shoppingCart.findOne({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: this.shoppingCartItems,
                    as: 'items'
                }
            ]
        });
        return shoppingCart;
    }
    async addBookToShoppingCart(shoppingCartData) {
        const book = await _database.DB.Books.findByPk(shoppingCartData.book_id);
        if (!book) {
            throw new Error(`Book with ID ${shoppingCartData.book_id} not found`);
        }
        if (!book.is_available) {
            throw new Error(`Book "${book.title}" is not available for purchase`);
        }
        if (book.stock_quantity <= 0) {
            throw new Error(`Book "${book.title}" is out of stock`);
        }
        let userCart = await this.shoppingCart.findOne({
            where: {
                user_id: shoppingCartData.user_id
            }
        });
        if (!userCart) {
            userCart = await this.shoppingCart.create({
                user_id: shoppingCartData.user_id
            });
        }
        const existingCartItem = await this.shoppingCartItems.findOne({
            where: {
                shopping_cart_id: userCart.id,
                book_id: shoppingCartData.book_id
            }
        });
        if (existingCartItem) {
            throw new Error(`Book "${book.title}" is already in your shopping cart`);
        }
        await this.shoppingCartItems.create({
            shopping_cart_id: userCart.id,
            book_id: shoppingCartData.book_id,
            quantity: 1
        });
        return userCart;
    }
    constructor(){
        _define_property(this, "shoppingCart", _database.DB.ShoppingCart);
        _define_property(this, "shoppingCartItems", _database.DB.ShoppingCartItems);
    }
};
const _default = ShoppingCartService;

//# sourceMappingURL=shoppingCart.service.js.map