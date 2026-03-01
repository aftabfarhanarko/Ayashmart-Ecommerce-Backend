import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { ReplyHelpDto } from './dto/reply-help.dto';
export declare class HelpController {
    private readonly helpService;
    constructor(helpService: HelpService);
    create(createHelpDto: CreateHelpDto, companyId?: string): Promise<import("./entities/help.entity").Help>;
    findAll(companyId?: string): Promise<import("./entities/help.entity").Help[]>;
    getStats(companyId?: string): Promise<{
        total: number;
        pending: number;
        in_progress: number;
        resolved: number;
        active: number;
    }>;
    findOne(id: number, companyId?: string): Promise<import("./entities/help.entity").Help>;
    update(id: number, updateHelpDto: UpdateHelpDto, companyId?: string): Promise<import("./entities/help.entity").Help>;
    addReply(id: number, replyDto: ReplyHelpDto, companyId?: string): Promise<import("./entities/help.entity").Help>;
    remove(id: number, companyId?: string): Promise<{
        success: boolean;
    }>;
}
