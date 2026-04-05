"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ShoppingCartController", {
    enumerable: true,
    get: function() {
        return ShoppingCartController;
    }
});
const _shoppingCartservice = /*#__PURE__*/ _interop_require_default(require("../services/shoppingCart.service"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let ShoppingCartController = class ShoppingCartController {
    constructor(){
        _define_property(this, "shoppingCartService", new _shoppingCartservice.default());
        _define_property(this, "getShoppingCart", async (req, res, next)=>{
            try {
                const userId = req.user.id;
                const shoppingCartData = await this.shoppingCartService.getShoppingCart(userId);
                res.status(200).json({
                    data: shoppingCartData,
                    message: 'List of items in shopping cart'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "addBookToShoppingCart", async (req, res, next)=>{
            try {
                const userId = req.user.id;
                const { book_id } = req.body;
                const addBookToShoppingCartData = await this.shoppingCartService.addBookToShoppingCart({
                    user_id: userId,
                    book_id
                });
                res.status(200).json({
                    data: addBookToShoppingCartData,
                    message: 'Added book to shopping cart'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=shoppingCart.controller.js.map