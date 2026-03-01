"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromocodeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_promocode_dto_1 = require("./create-promocode.dto");
class UpdatePromocodeDto extends (0, mapped_types_1.PartialType)(create_promocode_dto_1.CreatePromocodeDto) {
}
exports.UpdatePromocodeDto = UpdatePromocodeDto;
//# sourceMappingURL=update-promocode.dto.js.map