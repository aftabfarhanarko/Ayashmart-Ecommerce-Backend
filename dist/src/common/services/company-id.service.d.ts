import { Repository } from 'typeorm';
import { SystemUser } from '../../systemuser/entities/systemuser.entity';
export declare class CompanyIdService {
    private readonly systemUserRepo;
    constructor(systemUserRepo: Repository<SystemUser>);
    generateNextCompanyId(): Promise<string>;
}
