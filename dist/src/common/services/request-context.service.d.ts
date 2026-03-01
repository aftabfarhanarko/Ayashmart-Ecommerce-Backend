import { Request } from 'express';
export declare class RequestContextService {
    private readonly request;
    constructor(request: Request);
    getCompanyId(): string;
    getUserId(): number;
}
