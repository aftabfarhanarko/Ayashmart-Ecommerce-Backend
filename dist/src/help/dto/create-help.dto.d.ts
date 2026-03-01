import { SupportStatus } from '../entities/help.entity';
export declare class CreateHelpDto {
    email: string;
    issue: string;
    status?: SupportStatus;
    companyId?: string;
    priority?: string;
    tags?: string[];
    attachments?: string[];
}
