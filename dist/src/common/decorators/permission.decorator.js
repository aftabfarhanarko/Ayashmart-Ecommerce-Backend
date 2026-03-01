"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSION_KEY = 'permission';
const Permission = (permission) => (0, common_1.SetMetadata)(exports.PERMISSION_KEY, permission);
exports.Permission = Permission;
//# sourceMappingURL=permission.decorator.js.map