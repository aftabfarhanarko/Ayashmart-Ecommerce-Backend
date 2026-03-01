"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePackageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_package_dto_1 = require("./create-package.dto");
class UpdatePackageDto extends (0, swagger_1.PartialType)(create_package_dto_1.CreatePackageDto) {
}
exports.UpdatePackageDto = UpdatePackageDto;
//# sourceMappingURL=update-package.dto.js.map