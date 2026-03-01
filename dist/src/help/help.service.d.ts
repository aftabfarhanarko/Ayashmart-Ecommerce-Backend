import { Repository } from 'typeorm';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { ReplyHelpDto } from './dto/reply-help.dto';
import { Help } from './entities/help.entity';
import { HelpSupportGateway } from './help-support.gateway';
export declare class HelpService {
    private readonly helpRepo;
    private readonly mailer;
    private readonly helpSupportGateway;
    constructor(helpRepo: Repository<Help>, mailer: {
        sendMail: (message: unknown) => Promise<{
            id?: string;
        }>;
    }, helpSupportGateway: HelpSupportGateway);
    create(createHelpDto: CreateHelpDto, companyId?: string | undefined): Promise<Help>;
    findAll(companyId?: string | undefined): Promise<Help[]>;
    getStats(companyId?: string | undefined): Promise<{
        total: number;
        pending: number;
        in_progress: number;
        resolved: number;
        active: number;
    }>;
    findOne(id: number, companyId?: string | undefined): Promise<Help>;
    update(id: number, updateHelpDto: UpdateHelpDto, companyId?: string | undefined): Promise<Help>;
    remove(id: number, companyId?: string | undefined): Promise<{
        success: boolean;
    }>;
    addReply(id: number, replyDto: ReplyHelpDto, companyId?: string | undefined): Promise<Help>;
    private sendSupportEmail;
}
