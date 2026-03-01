import { TremsCondetionsService } from './trems-condetions.service';
import { CreateTremsCondetionDto } from './dto/create-trems-condetion.dto';
import { UpdateTremsCondetionDto } from './dto/update-trems-condetion.dto';
export declare class TremsCondetionsController {
    private readonly tremsCondetionsService;
    constructor(tremsCondetionsService: TremsCondetionsService);
    create(createTremsCondetionDto: CreateTremsCondetionDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/trems-condetion.entity").TremsCondetion;
    }>;
    findPublic(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/trems-condetion.entity").TremsCondetion[];
    }>;
    findAll(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/trems-condetion.entity").TremsCondetion[];
    }>;
    findOne(id: number, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/trems-condetion.entity").TremsCondetion;
    }>;
    update(id: number, updateTremsCondetionDto: UpdateTremsCondetionDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/trems-condetion.entity").TremsCondetion;
    }>;
    remove(id: number, companyId: string): Promise<{
        status: string;
        message: string;
    }>;
}
