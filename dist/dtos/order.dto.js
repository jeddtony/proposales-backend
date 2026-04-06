"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateOrderDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'User ID must be a valid number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID is required' }),
    (0, class_validator_1.Min)(1, { message: 'User ID must be greater than 0' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderDto.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Order date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreateOrderDto.prototype, "order_date", void 0);
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=order.dto.js.map