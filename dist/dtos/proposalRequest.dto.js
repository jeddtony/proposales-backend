"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProposalRequestDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateProposalRequestDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateProposalRequestDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], CreateProposalRequestDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateProposalRequestDto.prototype, "phone_number", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateProposalRequestDto.prototype, "company_name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateProposalRequestDto.prototype, "details", void 0);
exports.CreateProposalRequestDto = CreateProposalRequestDto;
//# sourceMappingURL=proposalRequest.dto.js.map