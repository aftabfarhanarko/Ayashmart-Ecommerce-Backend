"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = void 0;
const common_1 = require("@nestjs/common");
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user?.userId || request.user?.sub;
    if (!userId) {
        throw new common_1.UnauthorizedException('User not authenticated');
    }
    return userId;
});
//# sourceMappingURL=user-id.decorator.js.map