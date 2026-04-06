"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderItemsDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateOrderItemsDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateOrderItemsDto.prototype, "order_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateOrderItemsDto.prototype, "book_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateOrderItemsDto.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateOrderItemsDto.prototype, "price_at_purchase", void 0);
exports.CreateOrderItemsDto = CreateOrderItemsDto;
//# sourceMappingURL=orderItems.dto.js.map