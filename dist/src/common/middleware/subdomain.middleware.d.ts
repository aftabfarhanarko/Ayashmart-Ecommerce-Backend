import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { SystemUser } from '../../systemuser/entities/systemuser.entity';
import { Cache } from 'cache-manager';
export declare class SubdomainMiddleware implements NestMiddleware {
    private readonly systemUserRepo;
    private cacheManager;
    constructor(systemUserRepo: Repository<SystemUser>, cacheManager: Cache);
    use(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
