import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract companyId from request.
 * Order: query.companyId (explicit) > request.companyId (guard) > request.user.companyId (JWT).
 * Usage: @CompanyId() companyId: string
 */
export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const fromQuery = request.query?.companyId;
    if (fromQuery && typeof fromQuery === 'string' && fromQuery.trim()) {
      return fromQuery.trim();
    }
    return request.companyId || request.user?.companyId;
  },
);


