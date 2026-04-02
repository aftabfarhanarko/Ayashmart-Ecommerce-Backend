import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpStatus, Patch, Query, Req, BadRequestException, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CompanyId } from '../common/decorators/company-id.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { DashboardService } from '../dashboard/dashboard.service';
import { Public } from '../common/decorators/public.decorator';
import { SystemUserRole } from '../systemuser/system-user-role.enum';

@Controller("categories")
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly dashboardService: DashboardService,
  ) { }

  @Post()
  async create(
    @Body() createDto: CreateCategoryDto,
    @Query("companyId") companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException("companyId is required");
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const performedByUserId =
      role && [SystemUserRole.SUPER_ADMIN, SystemUserRole.SYSTEM_OWNER, SystemUserRole.EMPLOYEE].includes(role)
        ? numericUserId
        : undefined;
    const resellerId = role === SystemUserRole.RESELLER ? numericUserId : undefined;

    const category = await this.categoryService.create(
      createDto,
      companyId as string,
      performedByUserId,
      resellerId,
    );
    return { statusCode: HttpStatus.CREATED, message: "Category created", data: category };
  }

  @Get()
  async findAll(
    @Query("companyId") companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Query("resellerId") resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId = resellerIdFromQuery ? +resellerIdFromQuery : undefined;

    const categories = await this.categoryService.findAll(
      companyId as string,
      resellerId,
    );
    return { statusCode: HttpStatus.OK, data: categories };
  }

  @Get("trash")
  async listTrash(
    @Query("companyId") companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException("companyId is required");
    const categories = await this.categoryService.listTrashed(companyId as string);
    return { statusCode: HttpStatus.OK, data: categories };
  }

  @Get("stats")
  async getCategoryStats(@CompanyId() companyId: string) {
    const data = await this.dashboardService.getCategoryStats(companyId);
    return {
      statusCode: 200,
      message: 'Category stats retrieved successfully',
      data,
    };
  }

  @Public()
  @Get("public")
  async findPublic(@Query("companyId") companyId: string) {
    if (!companyId) throw new BadRequestException("companyId is required");
    const categories = await this.categoryService.findPublic(companyId);
    return { statusCode: HttpStatus.OK, data: categories };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const category = await this.categoryService.findOne(id, companyId);
    return { statusCode: HttpStatus.OK, data: category };
  }

  @Patch(":id/restore")
  async restore(
    @Param("id", ParseIntPipe) id: number,
    @Query("companyId") companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException("companyId is required");
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const category = await this.categoryService.restore(id, companyId as string, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Category restored", data: category };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryDto,
    @Query("companyId") companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const category = await this.categoryService.update(id, updateDto, companyId as string, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Category updated", data: category };
  }

  @Delete(":id")
  async softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    await this.categoryService.softDelete(id, companyId, performedByUserId);
    return { statusCode: HttpStatus.OK, message: "Category moved to trash" };
  }

  @Patch(":id/toggle-active")
  async toggleActive(
    @Param("id", ParseIntPipe) id: number,
    @Query("active") active: string | undefined,
    @CompanyId() companyId: string,
  ) {
    const activeBool =
      active !== undefined
        ? ["true", "1"].includes(active.toLowerCase())
        : undefined;

    const category = await this.categoryService.toggleActive(id, activeBool, companyId);
    const state = category.isActive ? "activated" : "disabled";
    return { statusCode: HttpStatus.OK, message: `Category ${state}`, data: category };
  }
}
