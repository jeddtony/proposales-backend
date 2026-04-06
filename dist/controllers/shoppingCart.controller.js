"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartController = void 0;
const tslib_1 = require("tslib");
const shoppingCart_service_1 = tslib_1.__importDefault(require("@services/shoppingCart.service"));
class ShoppingCartController {
    constructor() {
        this.shoppingCartService = new shoppingCart_service_1.default();
        this.getShoppingCart = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const shoppingCartData = await this.shoppingCartService.getShoppingCart(userId);
                res.status(200).json({ data: shoppingCartData, message: 'List of items in shopping cart' });
            }
            catch (error) {
                next(error);
            }
        };
        this.addBookToShoppingCart = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { book_id } = req.body;
                const addBookToShoppingCartData = await this.shoppingCartService.addBookToShoppingCart({ user_id: userId, book_id });
                res.status(200).json({ data: addBookToShoppingCartData, message: 'Added book to shopping cart' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ShoppingCartController = ShoppingCartController;
//# sourceMappingURL=shoppingCart.controller.js.map