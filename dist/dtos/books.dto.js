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
    get CreateBookDto () {
        return CreateBookDto;
    },
    get UpdateBookDto () {
        return UpdateBookDto;
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
let CreateBookDto = class CreateBookDto {
    constructor(){
        _define_property(this, "title", void 0);
        _define_property(this, "author", void 0);
        _define_property(this, "genre", void 0);
        _define_property(this, "price", void 0);
        _define_property(this, "stock_quantity", void 0);
        _define_property(this, "description", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Title is required'
    }),
    (0, _classvalidator.Length)(1, 255, {
        message: 'Title must be between 1 and 255 characters'
    }),
    _ts_metadata("design:type", String)
], CreateBookDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Author is required'
    }),
    (0, _classvalidator.Length)(1, 255, {
        message: 'Author must be between 1 and 255 characters'
    }),
    _ts_metadata("design:type", String)
], CreateBookDto.prototype, "author", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Genre is required'
    }),
    (0, _classvalidator.Length)(1, 100, {
        message: 'Genre must be between 1 and 100 characters'
    }),
    _ts_metadata("design:type", String)
], CreateBookDto.prototype, "genre", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Price must be a valid number'
    }),
    (0, _classvalidator.Min)(0, {
        message: 'Price must be greater than or equal to 0'
    }),
    (0, _classvalidator.Max)(999999, {
        message: 'Price must be less than 999999'
    }),
    _ts_metadata("design:type", Number)
], CreateBookDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Stock quantity must be a valid number'
    }),
    (0, _classvalidator.Min)(0, {
        message: 'Stock quantity must be greater than or equal to 0'
    }),
    (0, _classvalidator.Max)(999999, {
        message: 'Stock quantity must be less than 999999'
    }),
    _ts_metadata("design:type", Number)
], CreateBookDto.prototype, "stock_quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: "Description is required"
    }),
    (0, _classvalidator.Length)(10, 1000, {
        message: "Description must be between 10 and 1000 characters"
    }),
    _ts_metadata("design:type", String)
], CreateBookDto.prototype, "description", void 0);
let UpdateBookDto = class UpdateBookDto {
    constructor(){
        _define_property(this, "title", void 0);
        _define_property(this, "author", void 0);
        _define_property(this, "genre", void 0);
        _define_property(this, "is_available", void 0);
        _define_property(this, "price", void 0);
        _define_property(this, "stock_quantity", void 0);
        _define_property(this, "description", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Title is required'
    }),
    (0, _classvalidator.Length)(1, 255, {
        message: 'Title must be between 1 and 255 characters'
    }),
    _ts_metadata("design:type", String)
], UpdateBookDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Author is required'
    }),
    (0, _classvalidator.Length)(1, 255, {
        message: 'Author must be between 1 and 255 characters'
    }),
    _ts_metadata("design:type", String)
], UpdateBookDto.prototype, "author", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Genre is required'
    }),
    (0, _classvalidator.Length)(1, 100, {
        message: 'Genre must be between 1 and 100 characters'
    }),
    _ts_metadata("design:type", String)
], UpdateBookDto.prototype, "genre", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Availability status is required'
    }),
    _ts_metadata("design:type", Boolean)
], UpdateBookDto.prototype, "is_available", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Price must be a valid number'
    }),
    (0, _classvalidator.Min)(0, {
        message: 'Price must be greater than or equal to 0'
    }),
    (0, _classvalidator.Max)(999999, {
        message: 'Price must be less than 999999'
    }),
    _ts_metadata("design:type", Number)
], UpdateBookDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)({}, {
        message: 'Stock quantity must be a valid number'
    }),
    (0, _classvalidator.Min)(0, {
        message: 'Stock quantity must be greater than or equal to 0'
    }),
    (0, _classvalidator.Max)(999999, {
        message: 'Stock quantity must be less than 999999'
    }),
    _ts_metadata("design:type", Number)
], UpdateBookDto.prototype, "stock_quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: "Description is required"
    }),
    (0, _classvalidator.Length)(10, 1000, {
        message: "Description must be between 10 and 1000 characters"
    }),
    _ts_metadata("design:type", String)
], UpdateBookDto.prototype, "description", void 0);

//# sourceMappingURL=books.dto.js.map