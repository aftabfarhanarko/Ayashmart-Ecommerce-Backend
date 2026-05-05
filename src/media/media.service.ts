import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async create(
    createMediaDto: CreateMediaDto,
    companyId: string,
  ): Promise<MediaEntity> {
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    const media = this.mediaRepository.create({
      ...createMediaDto,
      companyId,
    });
    return this.mediaRepository.save(media);
  }
  async uploadFile(
    file: Express.Multer.File,
    companyId: string,
  ): Promise<MediaEntity> {
    if (!companyId) throw new BadRequestException('CompanyId is required');
    if (!file) throw new BadRequestException('File is required');

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: JPG, PNG, WEBP, GIF',
      );
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 20MB');
    }

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'JPG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
      'image/webp': 'WEBP',
      'image/gif': 'GIF',
    };
    const type = mimeToExt[file.mimetype];
    const ext = path.extname(file.originalname) || `.${type.toLowerCase()}`;

    const rawName = path.basename(file.originalname, ext);
    const title =
      rawName.replace(/[^a-zA-Z0-9-_]/g, '_') || `image_${Date.now()}`;
    const size = this.formatFileSize(file.size);

    const imgbbApiKey =
      process.env.IMGBB_API_KEY || '9a222d83ac769876ed9961fa873ebb51';
    const imgbbUploadUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

    let cdnUrl: string | undefined;
    try {
      const formData = new FormData();
      formData.append('image', file.buffer, {
        filename: file.originalname || 'image.jpg',
        contentType: file.mimetype,
      });

      const response = await axios.post(imgbbUploadUrl, formData, {
        headers: formData.getHeaders(),
      });

      const data = response?.data as
        | {
            success?: boolean;
            data?: {
              url?: string;
              display_url?: string;
            };
            error?: {
              message?: string;
            };
          }
        | null;

      const uploadedUrl = data?.data?.display_url || data?.data?.url;
      if (!data?.success || !uploadedUrl) {
        throw new BadRequestException(
          data?.error?.message || 'ImgBB upload response invalid',
        );
      }

      cdnUrl = uploadedUrl;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[MediaService] ImgBB upload failed', error);
      throw new BadRequestException('Failed to upload image to ImgBB');
    }

    if (!cdnUrl) {
      throw new BadRequestException('CDN did not return a URL');
    }

    const media = this.mediaRepository.create({
      title,
      type,
      size,
      url: cdnUrl,
      companyId,
      filename: file.originalname,
    });

    return this.mediaRepository.save(media);
  }

  async findAll(
    companyId: string,
    options?: {
      search?: string;
      sortBy?: 'newest' | 'name' | 'size' | 'date';
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: MediaEntity[]; total: number; page: number; totalPages: number }> {
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }

    const page = options?.page ?? 1;
    const limit = Math.min(options?.limit ?? 24, 100);
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.companyId = :companyId', { companyId });

    if (options?.search?.trim()) {
      queryBuilder.andWhere(
        '(media.title ILIKE :search OR media.type ILIKE :search)',
        { search: `%${options.search.trim()}%` },
      );
    }

    const sortBy = options?.sortBy ?? 'newest';
    switch (sortBy) {
      case 'name':
        queryBuilder.orderBy('media.title', 'ASC');
        break;
      case 'size':
        queryBuilder.orderBy('media.size', 'DESC');
        break;
      case 'date':
        queryBuilder.orderBy('media.createdAt', 'ASC');
        break;
      default:
        queryBuilder.orderBy('media.createdAt', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return { data, total, page, totalPages };
  }

  async findOne(id: number, companyId: string): Promise<MediaEntity | null> {
    return this.mediaRepository.findOne({
      where: { id, companyId },
    });
  }

  async update(
    id: number,
    updateMediaDto: UpdateMediaDto,
    companyId: string,
  ): Promise<MediaEntity> {
    const media = await this.findOne(id, companyId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    Object.assign(media, updateMediaDto);
    return this.mediaRepository.save(media);
  }

  async remove(id: number, companyId: string): Promise<void> {
    const media = await this.findOne(id, companyId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.filename) {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'media');
      const filePath = path.join(uploadsDir, media.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('Failed to delete file from disk:', err);
      }
    }

    await this.mediaRepository.delete(id);
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
