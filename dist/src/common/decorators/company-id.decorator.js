"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyId = void 0;
const common_1 = require("@nestjs/common");
exports.CompanyId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const fromQuery = request.query?.companyId;
    if (fromQuery && typeof fromQuery === 'string' && fromQuery.trim()) {
        return fromQuery.trim();
    }
    return request.companyId || request.user?.companyId;
});
//# sourceMappingURL=company-id.decorator.js.map