"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFraudcheckerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fraudchecker_dto_1 = require("./create-fraudchecker.dto");
class UpdateFraudcheckerDto extends (0, mapped_types_1.PartialType)(create_fraudchecker_dto_1.CreateFraudcheckerDto) {
}
exports.UpdateFraudcheckerDto = UpdateFraudcheckerDto;
//# sourceMappingURL=update-fraudchecker.dto.js.map