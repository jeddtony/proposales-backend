"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookDto = exports.CreateBookDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateBookDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Title must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateBookDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Author is required' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Author must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateBookDto.prototype, "author", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Genre is required' }),
    (0, class_validator_1.Length)(1, 100, { message: 'Genre must be between 1 and 100 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateBookDto.prototype, "genre", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Price must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(999999, { message: 'Price must be less than 999999' }),
    tslib_1.__metadata("design:type", Number)
], CreateBookDto.prototype, "price", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Stock quantity must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Stock quantity must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(999999, { message: 'Stock quantity must be less than 999999' }),
    tslib_1.__metadata("design:type", Number)
], CreateBookDto.prototype, "stock_quantity", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.Length)(10, 1000, { message: 'Description must be between 10 and 1000 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateBookDto.prototype, "description", void 0);
exports.CreateBookDto = CreateBookDto;
class UpdateBookDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Title must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], UpdateBookDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Author is required' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Author must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], UpdateBookDto.prototype, "author", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Genre is required' }),
    (0, class_validator_1.Length)(1, 100, { message: 'Genre must be between 1 and 100 characters' }),
    tslib_1.__metadata("design:type", String)
], UpdateBookDto.prototype, "genre", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Availability status is required' }),
    tslib_1.__metadata("design:type", Boolean)
], UpdateBookDto.prototype, "is_available", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Price must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(999999, { message: 'Price must be less than 999999' }),
    tslib_1.__metadata("design:type", Number)
], UpdateBookDto.prototype, "price", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Stock quantity must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Stock quantity must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(999999, { message: 'Stock quantity must be less than 999999' }),
    tslib_1.__metadata("design:type", Number)
], UpdateBookDto.prototype, "stock_quantity", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.Length)(10, 1000, { message: 'Description must be between 10 and 1000 characters' }),
    tslib_1.__metadata("design:type", String)
], UpdateBookDto.prototype, "description", void 0);
exports.UpdateBookDto = UpdateBookDto;
//# sourceMappingURL=books.dto.js.map