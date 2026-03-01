import { Repository } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
export declare class MediaService {
    private readonly mediaRepository;
    constructor(mediaRepository: Repository<MediaEntity>);
    create(createMediaDto: CreateMediaDto, companyId: string): Promise<MediaEntity>;
    uploadFile(file: Express.Multer.File, companyId: string): Promise<MediaEntity>;
    findAll(companyId: string, options?: {
        search?: string;
        sortBy?: 'newest' | 'name' | 'size' | 'date';
        page?: number;
        limit?: number;
    }): Promise<{
        data: MediaEntity[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number, companyId: string): Promise<MediaEntity | null>;
    update(id: number, updateMediaDto: UpdateMediaDto, companyId: string): Promise<MediaEntity>;
    remove(id: number, companyId: string): Promise<void>;
    private formatFileSize;
}
