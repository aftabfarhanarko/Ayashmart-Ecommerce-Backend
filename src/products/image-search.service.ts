import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ConfigService } from '@nestjs/config';

export interface ImageSearchResult {
  match40: Array<{ product: ProductEntity; matchScore: number }>;
  match60: Array<{ product: ProductEntity; matchScore: number }>;
  imageLabels: string[];
}

@Injectable()
export class ImageSearchService {
  private visionClient: any = null;

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly configService: ConfigService,
  ) {
    this.initVisionClient();
  }

  private initVisionClient() {
    const credentialsPath = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
    if (credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        // Dynamic import to avoid failing when @google-cloud/vision is not installed
        const vision = require('@google-cloud/vision');
        this.visionClient = new vision.ImageAnnotatorClient();
      } catch {
        this.visionClient = null;
      }
    }
  }

  /**
   * Extract labels/objects from image using Google Cloud Vision API.
   * Falls back to filename-based keywords when Vision is not configured.
   */
  private async extractLabelsFromImage(imageBuffer: Buffer, filename?: string): Promise<string[]> {
    if (this.visionClient) {
      try {
        const [result] = await this.visionClient.labelDetection({
          image: { content: imageBuffer },
        });
        const labels = result.labelAnnotations || [];
        return labels
          .filter((l: any) => l.score && l.score >= 0.5)
          .map((l: any) => l.description?.toLowerCase())
          .filter(Boolean);
      } catch (err) {
        console.warn('Vision API failed, falling back to filename:', err?.message);
      }
    }

    // Fallback: extract keywords from filename (e.g., "red-running-shoe.jpg" -> ["red","running","shoe"])
    if (filename) {
      const baseName = filename.replace(/\.[^/.]+$/, '');
      return baseName
        .toLowerCase()
        .split(/[-_\s]+/)
        .filter((w) => w.length > 2);
    }
    return [];
  }

  /**
   * Compute similarity score (0-100) between image labels and product text.
   */
  private computeSimilarity(
    imageLabels: string[],
    product: ProductEntity,
  ): number {
    const categoryName =
      product.category && typeof product.category === 'object' && 'name' in product.category
        ? (product.category as { name: string }).name
        : '';
    const productText = [product.name, product.description || '', categoryName]
      .join(' ')
      .toLowerCase();

    const productTokens = new Set(
      productText
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2),
    );

    if (imageLabels.length === 0) {
      return 0;
    }

    let matches = 0;
    for (const label of imageLabels) {
      if (productTokens.has(label)) {
        matches++;
        continue;
      }
      // Partial match: label contained in any product token or vice versa
      for (const token of productTokens) {
        if (token.includes(label) || label.includes(token)) {
          matches++;
          break;
        }
      }
    }

    const score = (matches / imageLabels.length) * 100;
    return Math.min(100, Math.round(score * 10) / 10);
  }

  /**
   * Search products by image. Returns products matching at 40% and 60% thresholds.
   */
  async searchByImage(
    imageBuffer: Buffer,
    companyId: string,
    filename?: string,
  ): Promise<ImageSearchResult> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new BadRequestException('Image buffer is required');
    }

    const imageLabels = await this.extractLabelsFromImage(imageBuffer, filename);

    const products = await this.productRepository.find({
      where: {
        companyId,
        deletedAt: IsNull(),
        status: 'published',
        isActive: true,
      },
      relations: ['category'],
    });

    const scored = products
      .map((product) => ({
        product,
        matchScore: this.computeSimilarity(imageLabels, product),
      }))
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    const match40 = scored.filter((s) => s.matchScore >= 40);
    const match60 = scored.filter((s) => s.matchScore >= 60);

    return {
      match40,
      match60,
      imageLabels,
    };
  }
}
