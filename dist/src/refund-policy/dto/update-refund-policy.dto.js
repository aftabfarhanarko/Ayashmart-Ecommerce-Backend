"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRefundPolicyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_refund_policy_dto_1 = require("./create-refund-policy.dto");
class UpdateRefundPolicyDto extends (0, mapped_types_1.PartialType)(create_refund_policy_dto_1.CreateRefundPolicyDto) {
}
exports.UpdateRefundPolicyDto = UpdateRefundPolicyDto;
//# sourceMappingURL=update-refund-policy.dto.js.map