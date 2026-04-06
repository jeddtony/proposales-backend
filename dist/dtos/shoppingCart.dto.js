"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBookToShoppingCartRequestDto = exports.AddBookToShoppingCartDto = exports.CreateShoppingCartDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateShoppingCartDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'User ID must be a valid number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID is required' }),
    (0, class_validator_1.Min)(1, { message: 'User ID must be greater than 0' }),
    tslib_1.__metadata("design:type", Number)
], CreateShoppingCartDto.prototype, "user_id", void 0);
exports.CreateShoppingCartDto = CreateShoppingCartDto;
class AddBookToShoppingCartDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], AddBookToShoppingCartDto.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Book ID must be a valid number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Book ID is required' }),
    (0, class_validator_1.Min)(1, { message: 'Book ID must be greater than 0' }),
    tslib_1.__metadata("design:type", Number)
], AddBookToShoppingCartDto.prototype, "book_id", void 0);
exports.AddBookToShoppingCartDto = AddBookToShoppingCartDto;
class AddBookToShoppingCartRequestDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Book ID must be a valid number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Book ID is required' }),
    (0, class_validator_1.Min)(1, { message: 'Book ID must be greater than 0' }),
    tslib_1.__metadata("design:type", Number)
], AddBookToShoppingCartRequestDto.prototype, "book_id", void 0);
exports.AddBookToShoppingCartRequestDto = AddBookToShoppingCartRequestDto;
//# sourceMappingURL=shoppingCart.dto.js.map