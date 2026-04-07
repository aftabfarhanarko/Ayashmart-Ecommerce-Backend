import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FlashSellDto } from './dto/flash-sell.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard/dashboard.service';
import { Public } from '../common/decorators/public.decorator';
import { SystemUserRole } from '../systemuser/system-user-role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly dashboardService: DashboardService,
  ) { }

  @Post()
  async create(
    @Body() createDto: CreateProductDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    try {
      const companyId = companyIdFromQuery || companyIdFromToken;
      if (!companyId) {
        throw new BadRequestException('companyId is required');
      }
      const role: SystemUserRole | undefined = req?.user?.role;
      const numericUserId = +(req?.user?.userId || req?.user?.sub);
      const performedByUserId =
        role && [SystemUserRole.SUPER_ADMIN, SystemUserRole.SYSTEM_OWNER, SystemUserRole.EMPLOYEE].includes(role)
          ? numericUserId
          : undefined;
      const resellerId = (role === SystemUserRole.RESELLER || (role as any) === 'MERCHANT')
        ? numericUserId
        : undefined;

      const product = await this.productService.create(
        createDto,
        companyId,
        performedByUserId,
        resellerId,
      );
      return { statusCode: HttpStatus.CREATED, message: 'Product created', data: product };
    } catch (error) {
      // Re-throw known exceptions, wrap unknown errors
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to create product');
    }
  }

  @Get()
  async findAll(
    @Query('companyId') companyId: string,
    @Query('status') status?: 'draft' | 'published' | 'trashed' | 'pending',
    @Query('resellerId') resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId =
      (role === SystemUserRole.RESELLER || (role as any) === 'MERCHANT')
        ? numericUserId
        : resellerIdFromQuery
          ? +resellerIdFromQuery
          : undefined;

    const products = await this.productService.findAll(companyId, { status, resellerId });
    return { statusCode: HttpStatus.OK, data: products };
  }

  // Separate public endpoint: no auth/guards, only companyId
  @Public()
  @Get('all')
  async findAllPublic(@Query('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const products = await this.productService.findAll(companyId);
    return { statusCode: HttpStatus.OK, data: products };
  }

  /** Admin only: JWT + CompanyIdGuard required. Get all products with optional status filter. */
  @Get('admin')
  async findAllForAdmin(
    @Query('companyId') companyIdFromQuery: string,
    @CompanyId() companyIdFromToken: string,
    @Query('status') status?: 'draft' | 'published' | 'trashed' | 'pending',
    @Query('resellerId') resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId =
      (role === SystemUserRole.RESELLER || (role as any) === 'MERCHANT')
        ? numericUserId
        : resellerIdFromQuery
          ? +resellerIdFromQuery
          : undefined;

    const products = await this.productService.findAll(companyId, { status, resellerId });
    return { statusCode: HttpStatus.OK, data: products };
  }

  @Get('drafts')
  async getDrafts(
    @Query('companyId') companyId: string,
    @Query('resellerId') resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId =
      (role === SystemUserRole.RESELLER || (role as any) === 'MERCHANT')
        ? numericUserId
        : resellerIdFromQuery
          ? +resellerIdFromQuery
          : undefined;

    const products = await this.productService.getDraftProducts(companyId, resellerId);
    return { statusCode: HttpStatus.OK, data: products };
  }

  @Get('trash')
  async getTrash(
    @Query('companyId') companyId: string,
    @Query('resellerId') resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId =
      (role === SystemUserRole.RESELLER || (role as any) === 'MERCHANT')
        ? numericUserId
        : resellerIdFromQuery
          ? +resellerIdFromQuery
          : undefined;

    const products = await this.productService.getTrashedProducts(companyId, resellerId);
    return { statusCode: HttpStatus.OK, data: products };
  }

  @Get(':id/stock-history')
  async getStockHistory(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Query('limit') limit?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    const history = await this.productService.getStockHistory(id, companyId, limitNumber);
    return { statusCode: HttpStatus.OK, data: history };
  }

  @Get('category')
  async findByCategory(
    @Query('companyId') companyId: string,
    @Query('categories') categories?: string,
    @Query('categoryId') categoryId?: string
  ) {
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    const products = await this.productService.findByCategory(
      companyId,
      categories,
      parsedCategoryId
    );
    return { statusCode: HttpStatus.OK, data: products };
  }

  // Public endpoint for theme/storefront (no auth/guards)
  @Public()
  @Get('public/category')
  async findByCategoryPublic(
    @Query('companyId') companyId: string,
    @Query('categories') categories?: string | string[],
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    if (!companyId) throw new BadRequestException('companyId is required');

    const categoryNameStr =
      typeof categories === 'string'
        ? categories.trim()
        : Array.isArray(categories)
          ? (categories[0] && String(categories[0]).trim()) || undefined
          : undefined;
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    if (categoryId && (parsedCategoryId === undefined || Number.isNaN(parsedCategoryId))) {
      throw new BadRequestException('categoryId must be a number');
    }
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? Math.min(limitNum, 100) : 20;
    const safeOffset = Number.isFinite(offsetNum) && offsetNum >= 0 ? offsetNum : 0;

    const products = await this.productService.findPublicByCategory(
      companyId,
      categoryNameStr ?? undefined,
      parsedCategoryId,
      { limit: safeLimit, offset: safeOffset },
    );

    return { statusCode: HttpStatus.OK, data: products };
  }

  @Public()
  @Get('trending')
  async findTrending(
    @Query('companyId') companyId: string,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
  ) {
    if (!companyId) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'companyId is required', data: [] };
    }
    const daysParam = days ? parseInt(days, 10) : 30;
    const limitParam = limit ? parseInt(limit, 10) : 10;
    const products = await this.productService.findTrending(companyId, daysParam, limitParam);
    return { statusCode: HttpStatus.OK, data: products };
  }

  @Public()
  @Get('public')
  async findPublic(
    @Query('companyId') companyId: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ) {
    if (!companyId) throw new BadRequestException('companyId is required');

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    const products = await this.productService.findPublic(companyId, {
      categorySlug,
      limit: limitNum,
      offset: offsetNum,
      search,
    });

    return { statusCode: HttpStatus.OK, data: products };
  }

  @Public()
  @Get('public/:id')
  async findPublicOne(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ) {
    if (!companyId) throw new BadRequestException('companyId is required');
    const product = await this.productService.findPublicOne(companyId, id);
    return { statusCode: HttpStatus.OK, data: product };
  }

  @Get('stats')
  async getProductStats(@CompanyId() companyId: string) {
    const data = await this.dashboardService.getProductStats(companyId);
    return {
      statusCode: 200,
      message: 'Product stats retrieved successfully',
      data,
    };
  }

  @Post("bulk-upload")
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate file type
    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension) && !allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
    }

    try {
      let products: Array<{
        name: string;
        sku: string;
        price: number;
        discountPrice?: number;
        categoryId: number;
        isActive?: boolean;
        description?: string;
        thumbnail?: string;
        images?: string;
        stock?: number;
      }> = [];

      if (fileExtension === '.csv') {
        // Parse CSV
        const text = file.buffer.toString('utf-8');
        const lines = text.trim().split('\n');

        if (lines.length < 2) {
          throw new BadRequestException('CSV file must contain at least a header row and one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['name', 'sku', 'price', 'categoryid'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
          throw new BadRequestException(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          if (values.length < headers.length) continue;

          const product: any = {};
          headers.forEach((header, index) => {
            const value = values[index]?.trim();
            if (value) {
              if (['price', 'discountprice', 'categoryid', 'stock'].includes(header)) {
                product[header] = header === 'stock' ? (parseInt(value, 10) || 0) : (parseFloat(value) || parseInt(value, 10));
              } else if (header === 'isactive') {
                product[header] = value.toLowerCase() === 'true' || value === '1';
              } else {
                product[header] = value;
              }
            }
          });

          // Map headers to camelCase
          const stockVal = product.stock ?? product.Stock ?? product['stock quantity'];
          products.push({
            name: product.name || product.Name,
            sku: product.sku || product.SKU,
            price: product.price || product.Price,
            discountPrice: product.discountprice || product.discountPrice || product['discount price'],
            categoryId: product.categoryid || product.categoryId || product['category id'],
            isActive: product.isactive !== undefined ? product.isactive : (product.isActive !== undefined ? product.isActive : true),
            description: product.description || product.Description,
            thumbnail: product.thumbnail || product.Thumbnail,
            images: product.images || product.Images || product['image urls'],
            stock: stockVal !== undefined ? (parseInt(String(stockVal), 10) || 0) : undefined,
          });
        }
      } else {
        // Parse Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        if (data.length === 0) {
          throw new BadRequestException('Excel file is empty');
        }

        // Normalize headers (convert to lowercase, remove spaces)
        const normalizeHeader = (header: string) => header.toLowerCase().replace(/\s+/g, '');

        products = data.map((row: any) => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            normalizedRow[normalizeHeader(key)] = row[key];
          });

          const stockVal = normalizedRow.stock ?? normalizedRow.stockquantity ?? normalizedRow.inventory;
          return {
            name: normalizedRow.name || normalizedRow.productname || '',
            sku: normalizedRow.sku || '',
            price: parseFloat(normalizedRow.price) || 0,
            discountPrice: normalizedRow.discountprice ? parseFloat(normalizedRow.discountprice) : undefined,
            categoryId: parseInt(normalizedRow.categoryid || normalizedRow.category, 10) || 0,
            isActive: normalizedRow.isactive !== undefined
              ? (normalizedRow.isactive === true || normalizedRow.isactive === 'true' || normalizedRow.isactive === '1')
              : true,
            description: normalizedRow.description || '',
            thumbnail: normalizedRow.thumbnail || '',
            images: normalizedRow.images || normalizedRow.imageurls || '',
            stock: stockVal !== undefined && stockVal !== '' ? (parseInt(String(stockVal), 10) || 0) : undefined,
          };
        });
      }

      if (products.length === 0) {
        throw new BadRequestException('No products found in file');
      }

      const result = await this.productService.bulkCreate(products, companyId);

      return {
        statusCode: HttpStatus.OK,
        message: `Bulk upload completed. ${result.success.length} succeeded, ${result.failed.length} failed.`,
        data: {
          success: result.success.length,
          failed: result.failed.length,
          total: products.length,
          details: {
            successful: result.success.map(p => ({ id: p.id, name: p.name, sku: p.sku })),
            failed: result.failed,
          },
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const product = await this.productService.findOne(id, companyId);
    return { statusCode: HttpStatus.OK, data: product };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('companyId is required');
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const product = await this.productService.update(id, updateDto, companyId, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Product updated", data: product };
  }

  @Post("flash-sell")
  async setFlashSell(@Body() flashSellDto: FlashSellDto, @CompanyId() companyId: string) {
    const startTime = new Date(flashSellDto.flashSellStartTime);
    const endTime = new Date(flashSellDto.flashSellEndTime);
    const products = await this.productService.setFlashSell(
      flashSellDto.productIds,
      startTime,
      endTime,
      flashSellDto.flashSellPrice,
      companyId
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Flash sell set for selected products",
      data: products,
    };
  }

  @Delete("flash-sell")
  async removeFlashSell(@Body() body: { productIds: number[] }, @CompanyId() companyId: string) {
    const products = await this.productService.removeFlashSell(body.productIds, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: "Flash sell removed from selected products",
      data: products,
    };
  }

  @Delete(":id")
  async softDelete(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    await this.productService.softDelete(id, companyId, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Product moved to trash" };
  }

  @Patch(":id/recover")
  async recoverFromTrash(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const product = await this.productService.recoverFromTrash(id, companyId);
    return { statusCode: HttpStatus.OK, message: "Product recovered from trash", data: product };
  }

  @Patch(":id/publish")
  async publishDraft(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const product = await this.productService.publishDraft(id, companyId);
    return { statusCode: HttpStatus.OK, message: "Product approved and published", data: product };
  }

  @Patch(":id/reject")
  async rejectProduct(
    @Param("id", ParseIntPipe) id: number,
    @CompanyId() companyId: string,
    @Body() body: { reason?: string },
  ) {
    const product = await this.productService.rejectProduct(id, companyId, body?.reason);
    return { statusCode: HttpStatus.OK, message: "Product rejected", data: product };
  }

  @Get("pending-approval")
  async getPendingApproval(@CompanyId() companyId: string) {
    const products = await this.productService.getPendingApprovalProducts(companyId);
    return { statusCode: HttpStatus.OK, data: products };
  }

  @Delete(":id/permanent")
  async permanentDelete(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    await this.productService.permanentDelete(id, companyId, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Product permanently deleted" };
  }

  @Patch(":id/toggle-active")
  async toggleActive(@Param("id", ParseIntPipe) id: number, @Query("active") active: string, @CompanyId() companyId: string) {
    const isActive = active === "true";
    const product = await this.productService.toggleActive(id, isActive, companyId);
    return { statusCode: HttpStatus.OK, message: `Product ${isActive ? "activated" : "disabled"}`, data: product };
  }

  @Public()
  @Get("flash-sell/active")
  async getActiveFlashSellProducts(
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const products = await this.productService.getActiveFlashSellProducts(companyId);
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }
}
