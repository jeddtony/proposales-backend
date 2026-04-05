"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateOrderDto", {
    enumerable: true,
    get: function() {
        return CreateOrderDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
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
let CreateOrderDto = class CreateOrderDto {
    constructor(){
        _define_property(this, "user_id", void 0);
        _define_property(this, "order_date", void 0);
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
], CreateOrderDto.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Date),
    (0, _classvalidator.IsDate)({
        message: 'Order date must be a valid date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateOrderDto.prototype, "order_date", void 0);

//# sourceMappingURL=order.dto.js.map