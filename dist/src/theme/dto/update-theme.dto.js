"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateThemeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_theme_dto_1 = require("./create-theme.dto");
class UpdateThemeDto extends (0, mapped_types_1.PartialType)(create_theme_dto_1.CreateThemeDto) {
}
exports.UpdateThemeDto = UpdateThemeDto;
//# sourceMappingURL=update-theme.dto.js.map