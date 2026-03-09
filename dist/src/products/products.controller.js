"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const flash_sell_dto_1 = require("./dto/flash-sell.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const XLSX = require("xlsx");
const dashboard_service_1 = require("../dashboard/dashboard.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const system_user_role_enum_1 = require("../systemuser/system-user-role.enum");
let ProductController = class ProductController {
    constructor(productService, dashboardService) {
        this.productService = productService;
        this.dashboardService = dashboardService;
    }
    async create(createDto, companyIdFromQuery, companyIdFromToken, req) {
        try {
            const companyId = companyIdFromQuery || companyIdFromToken;
            if (!companyId) {
                throw new common_1.BadRequestException('companyId is required');
            }
            const role = req?.user?.role;
            const numericUserId = +(req?.user?.userId || req?.user?.sub);
            const performedByUserId = role && [system_user_role_enum_1.SystemUserRole.SUPER_ADMIN, system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER, system_user_role_enum_1.SystemUserRole.EMPLOYEE].includes(role)
                ? numericUserId
                : undefined;
            const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER ? numericUserId : undefined;
            const product = await this.productService.create(createDto, companyId, performedByUserId, resellerId);
            return { statusCode: common_1.HttpStatus.CREATED, message: 'Product created', data: product };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message || 'Failed to create product');
        }
    }
    async findAll(companyId, status, resellerIdFromQuery, req) {
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER
            ? numericUserId
            : resellerIdFromQuery
                ? +resellerIdFromQuery
                : undefined;
        const products = await this.productService.findAll(companyId, { status, resellerId });
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findAllPublic(companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const products = await this.productService.findAll(companyId);
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findAllForAdmin(companyIdFromQuery, companyIdFromToken, status, resellerIdFromQuery, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER
            ? numericUserId
            : resellerIdFromQuery
                ? +resellerIdFromQuery
                : undefined;
        const products = await this.productService.findAll(companyId, { status, resellerId });
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async getDrafts(companyId, resellerIdFromQuery, req) {
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER
            ? numericUserId
            : resellerIdFromQuery
                ? +resellerIdFromQuery
                : undefined;
        const products = await this.productService.getDraftProducts(companyId, resellerId);
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async getTrash(companyId, resellerIdFromQuery, req) {
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER
            ? numericUserId
            : resellerIdFromQuery
                ? +resellerIdFromQuery
                : undefined;
        const products = await this.productService.getTrashedProducts(companyId, resellerId);
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async getStockHistory(id, companyIdFromQuery, companyIdFromToken, limit) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const limitNumber = limit ? parseInt(limit, 10) : 50;
        const history = await this.productService.getStockHistory(id, companyId, limitNumber);
        return { statusCode: common_1.HttpStatus.OK, data: history };
    }
    async findByCategory(companyId, categories, categoryId) {
        const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        const products = await this.productService.findByCategory(companyId, categories, parsedCategoryId);
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findByCategoryPublic(companyId, categories, categoryId, limit, offset) {
        if (!companyId)
            throw new common_1.BadRequestException('companyId is required');
        const categoryNameStr = typeof categories === 'string'
            ? categories.trim()
            : Array.isArray(categories)
                ? (categories[0] && String(categories[0]).trim()) || undefined
                : undefined;
        const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        if (categoryId && (parsedCategoryId === undefined || Number.isNaN(parsedCategoryId))) {
            throw new common_1.BadRequestException('categoryId must be a number');
        }
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? Math.min(limitNum, 100) : 20;
        const safeOffset = Number.isFinite(offsetNum) && offsetNum >= 0 ? offsetNum : 0;
        const products = await this.productService.findPublicByCategory(companyId, categoryNameStr ?? undefined, parsedCategoryId, { limit: safeLimit, offset: safeOffset });
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findTrending(companyId, days, limit) {
        if (!companyId) {
            return { statusCode: common_1.HttpStatus.BAD_REQUEST, message: 'companyId is required', data: [] };
        }
        const daysParam = days ? parseInt(days, 10) : 30;
        const limitParam = limit ? parseInt(limit, 10) : 10;
        const products = await this.productService.findTrending(companyId, daysParam, limitParam);
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findPublic(companyId, categorySlug, limit, offset, search) {
        if (!companyId)
            throw new common_1.BadRequestException('companyId is required');
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const products = await this.productService.findPublic(companyId, {
            categorySlug,
            limit: limitNum,
            offset: offsetNum,
            search,
        });
        return { statusCode: common_1.HttpStatus.OK, data: products };
    }
    async findPublicOne(id, companyId) {
        if (!companyId)
            throw new common_1.BadRequestException('companyId is required');
        const product = await this.productService.findPublicOne(companyId, id);
        return { statusCode: common_1.HttpStatus.OK, data: product };
    }
    async getProductStats(companyId) {
        const data = await this.dashboardService.getProductStats(companyId);
        return {
            statusCode: 200,
            message: 'Product stats retrieved successfully',
            data,
        };
    }
    async bulkUpload(file, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const allowedMimeTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        const allowedExtensions = ['.csv', '.xls', '.xlsx'];
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(fileExtension) && !allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
        }
        try {
            let products = [];
            if (fileExtension === '.csv') {
                const text = file.buffer.toString('utf-8');
                const lines = text.trim().split('\n');
                if (lines.length < 2) {
                    throw new common_1.BadRequestException('CSV file must contain at least a header row and one data row');
                }
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const requiredHeaders = ['name', 'sku', 'price', 'categoryid'];
                const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
                if (missingHeaders.length > 0) {
                    throw new common_1.BadRequestException(`Missing required columns: ${missingHeaders.join(', ')}`);
                }
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    if (values.length < headers.length)
                        continue;
                    const product = {};
                    headers.forEach((header, index) => {
                        const value = values[index]?.trim();
                        if (value) {
                            if (['price', 'discountprice', 'categoryid', 'stock'].includes(header)) {
                                product[header] = header === 'stock' ? (parseInt(value, 10) || 0) : (parseFloat(value) || parseInt(value, 10));
                            }
                            else if (header === 'isactive') {
                                product[header] = value.toLowerCase() === 'true' || value === '1';
                            }
                            else {
                                product[header] = value;
                            }
                        }
                    });
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
            }
            else {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
                if (data.length === 0) {
                    throw new common_1.BadRequestException('Excel file is empty');
                }
                const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, '');
                products = data.map((row) => {
                    const normalizedRow = {};
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
                throw new common_1.BadRequestException('No products found in file');
            }
            const result = await this.productService.bulkCreate(products, companyId);
            return {
                statusCode: common_1.HttpStatus.OK,
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to process file: ${error.message}`);
        }
    }
    async findOne(id, companyId) {
        const product = await this.productService.findOne(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, data: product };
    }
    async update(id, updateDto, companyIdFromQuery, companyIdFromToken, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException('companyId is required');
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const product = await this.productService.update(id, updateDto, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Product updated", data: product };
    }
    async setFlashSell(flashSellDto, companyId) {
        const startTime = new Date(flashSellDto.flashSellStartTime);
        const endTime = new Date(flashSellDto.flashSellEndTime);
        const products = await this.productService.setFlashSell(flashSellDto.productIds, startTime, endTime, flashSellDto.flashSellPrice, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "Flash sell set for selected products",
            data: products,
        };
    }
    async removeFlashSell(body, companyId) {
        const products = await this.productService.removeFlashSell(body.productIds, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "Flash sell removed from selected products",
            data: products,
        };
    }
    async softDelete(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        await this.productService.softDelete(id, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Product moved to trash" };
    }
    async recoverFromTrash(id, companyId) {
        const product = await this.productService.recoverFromTrash(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: "Product recovered from trash", data: product };
    }
    async publishDraft(id, companyId) {
        const product = await this.productService.publishDraft(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: "Product published", data: product };
    }
    async permanentDelete(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        await this.productService.permanentDelete(id, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Product permanently deleted" };
    }
    async toggleActive(id, active, companyId) {
        const isActive = active === "true";
        const product = await this.productService.toggleActive(id, isActive, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: `Product ${isActive ? "activated" : "disabled"}`, data: product };
    }
    async getActiveFlashSellProducts(companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const products = await this.productService.getActiveFlashSellProducts(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data: products,
        };
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('resellerId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('resellerId')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Get)('drafts'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('resellerId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getDrafts", null);
__decorate([
    (0, common_1.Get)('trash'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('resellerId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getTrash", null);
__decorate([
    (0, common_1.Get)(':id/stock-history'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getStockHistory", null);
__decorate([
    (0, common_1.Get)('category'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categories')),
    __param(2, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/category'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categories')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCategoryPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('days')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findTrending", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categorySlug')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findPublicOne", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Post)("bulk-upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bulkUpload", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("flash-sell"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flash_sell_dto_1.FlashSellDto, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "setFlashSell", null);
__decorate([
    (0, common_1.Delete)("flash-sell"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "removeFlashSell", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Patch)(":id/recover"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "recoverFromTrash", null);
__decorate([
    (0, common_1.Patch)(":id/publish"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publishDraft", null);
__decorate([
    (0, common_1.Delete)(":id/permanent"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "permanentDelete", null);
__decorate([
    (0, common_1.Patch)(":id/toggle-active"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("active")),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "toggleActive", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("flash-sell/active"),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getActiveFlashSellProducts", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [products_service_1.ProductService,
        dashboard_service_1.DashboardService])
], ProductController);
//# sourceMappingURL=products.controller.js.map