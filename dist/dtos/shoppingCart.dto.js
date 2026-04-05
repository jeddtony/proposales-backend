"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AddBookToShoppingCartDto () {
        return AddBookToShoppingCartDto;
    },
    get AddBookToShoppingCartRequestDto () {
        return AddBookToShoppingCartRequestDto;
    },
    get CreateShoppingCartDto () {
        return CreateShoppingCartDto;
    }
});
const _classvalidator = require("class-validator");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateShoppingCartDto = class CreateShoppingCartDto {
    constructor(){
        _define_property(this, "user_id", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'User ID must be a valid number'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'User ID is required'
    }),
    (0, _classvalidator.Min)(1, {
        message: 'User ID must be greater than 0'
    }),
    _ts_metadata("design:type", Number)
], CreateShoppingCartDto.prototype, "user_id", void 0);
let AddBookToShoppingCartDto = class AddBookToShoppingCartDto {
    constructor(){
        _define_property(this, "user_id", void 0);
        _define_property(this, "book_id", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], AddBookToShoppingCartDto.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Book ID must be a valid number'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Book ID is required'
    }),
    (0, _classvalidator.Min)(1, {
        message: 'Book ID must be greater than 0'
    }),
    _ts_metadata("design:type", Number)
], AddBookToShoppingCartDto.prototype, "book_id", void 0);
let AddBookToShoppingCartRequestDto = class AddBookToShoppingCartRequestDto {
    constructor(){
        _define_property(this, "book_id", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Book ID must be a valid number'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Book ID is required'
    }),
    (0, _classvalidator.Min)(1, {
        message: 'Book ID must be greater than 0'
    }),
    _ts_metadata("design:type", Number)
], AddBookToShoppingCartRequestDto.prototype, "book_id", void 0);

//# sourceMappingURL=shoppingCart.dto.js.map