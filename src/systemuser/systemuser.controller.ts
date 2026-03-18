import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { SystemuserService } from './systemuser.service';
import { ActivityLogService } from './activity-log.service';
import { CreateSystemuserDto } from './dto/create-systemuser.dto';
import { UpdateSystemuserDto } from './dto/update-systemuser.dto';
import { LoginDto } from './dto/login.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Permission } from '../common/decorators/permission.decorator';
import { FeaturePermission } from './feature-permission.enum';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { SystemUserRole } from './system-user-role.enum';
import { ActivityAction, ActivityEntity } from './entities/activity-log.entity';
import { Public } from '../common/decorators/public.decorator';


@Controller('systemuser')
// @UseGuards(JwtAuthGuard)
export class SystemuserController {
  constructor(
    private readonly systemuserService: SystemuserService,
    private readonly activityLogService: ActivityLogService,
  ) { }

  // System Owner creation endpoint - accessible to System Owners
  @Post('create-system-owner')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.MANAGE_USERS)
  async createSystemOwner(
    @Body() createSystemuserDto: CreateSystemuserDto,
    @CompanyId() creatorCompanyId?: string,
    @Req() req?: any,
  ) {
    // Force role to SYSTEM_OWNER
    createSystemuserDto.role = SystemUserRole.SYSTEM_OWNER;
    // Get creator role and user ID from JWT
    const creatorRole = req?.user?.role || SystemUserRole.EMPLOYEE;
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    // System Owner creates another System Owner - they share the same companyId
    return this.systemuserService.create(createSystemuserDto, creatorCompanyId, creatorRole, performedByUserId);
  }

  // System Owner/Employee endpoint - requires auth
  @Post()
  // @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  @Public()
  create(
    @Body() createSystemuserDto: CreateSystemuserDto,
    @CompanyId() creatorCompanyId?: string,
    @Req() req?: any,
  ) {
    // Get creator role and user ID from JWT (if authenticated)
    // If there is no authenticated user, creatorRole stays undefined so that
    // the service can treat this as a "self-created" System Owner.
    const creatorRole = req?.user?.role as SystemUserRole | undefined;
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    // If creator has companyId, new user will share the same companyId
    // Otherwise, a new companyId will be generated
    return this.systemuserService.create(createSystemuserDto, creatorCompanyId, creatorRole, performedByUserId);
  }

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.systemuserService.login(dto);
  }

  @Get()

  // @Permission(FeaturePermission.STAFF)
  findAll(@CompanyId() companyId?: string, @Req() req?: any) {
    // Superadmins can see all system users (ignore companyId filter)
    const userRole = req?.user?.role;
    if (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) {
      return this.systemuserService.findAll(undefined);
    }
    // Only return users from the same company
    return this.systemuserService.findAll(companyId);
  }

  @Get('trash')
  async listTrash(
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const userRole = req?.user?.role;
    if (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) {
      return this.systemuserService.listTrashed(undefined);
    }
    const companyId = companyIdFromQuery || companyIdFromToken;
    return this.systemuserService.listTrashed(companyId);
  }

  // activity-logs routes MUST be declared before :id - otherwise :id catches "activity-logs" as id
  @Get('activity-logs')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  async getActivityLogs(
    @CompanyId() companyId?: string,
    @Query('performedByUserId') performedByUserId?: string,
    @Query('targetUserId') targetUserId?: string,
    @Query('action') action?: ActivityAction,
    @Query('entity') entity?: ActivityEntity,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Req() req?: any,
  ) {
    const userRole = req?.user?.role;
    const currentUserId = req?.user?.userId || req?.user?.sub;

    const filters: any = {};

    // Regular users can only see their own activity logs
    if (userRole !== SystemUserRole.SYSTEM_OWNER && userRole !== SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
      filters.performedByUserId = currentUserId;
      filters.targetUserId = currentUserId; // Only show activities related to themselves
    } else {
      // SYSTEM_OWNER and SUPER_ADMIN can filter by any user
      if (performedByUserId) filters.performedByUserId = +performedByUserId;
      if (targetUserId) filters.targetUserId = +targetUserId;
    }

    if (action) filters.action = action;
    if (entity) filters.entity = entity;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (limit) filters.limit = +limit;
    if (offset) filters.offset = +offset;

    // Superadmins can see all activity logs (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : (companyId || '');
    return this.activityLogService.getActivityLogs(filterCompanyId, filters);
  }

  @Get('activity-logs/:id')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  async getActivityLogById(@Param('id') id: string, @CompanyId() companyId?: string, @Req() req?: any) {
    const userRole = req?.user?.role;
    const currentUserId = req?.user?.userId || req?.user?.sub;

    // Superadmins can view any activity log (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : (companyId || '');

    // Get the activity log first to check ownership
    const activityLog = await this.activityLogService.getActivityLogById(+id, filterCompanyId);

    // Check if activity log exists
    if (!activityLog) {
      throw new NotFoundException('Activity log not found');
    }

    // Regular users can only view their own activity logs
    if (userRole !== SystemUserRole.SYSTEM_OWNER && userRole !== SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
      if (activityLog.performedByUserId !== currentUserId && activityLog.targetUserId !== currentUserId) {
        throw new BadRequestException('You can only view your own activity logs');
      }
    }

    return activityLog;
  }

  @Get(':id')
    // @UseGuards(JwtAuthGuard)
    @Public()
  // @Permission(FeaturePermission.STAFF)
  findOne(@Param('id') id: string, @CompanyId() companyId?: string, @Req() req?: any) {
    // Superadmins can access any system user (ignore companyId filter)
    const userRole = req?.user?.role;
    if (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) {
      return this.systemuserService.findOne(+id, undefined);
    }
    return this.systemuserService.findOne(+id, companyId);
  }

  /** Revert current user's package to the previous one (fallback when payment fails/cancelled). */
  @Patch(':id/revert-package')
  @UseGuards(JwtAuthGuard)
  async revertPackage(
    @Param('id') id: string,
    @CompanyId() companyId?: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    if (performedByUserId !== +id && userRole !== 'SUPER_ADMIN' && userRole !== SystemUserRole.SUPER_ADMIN) {
      throw new BadRequestException('You can only revert your own package');
    }
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    return this.systemuserService.revertToPreviousPackage(+id, filterCompanyId, performedByUserId);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @Public()
  // @Permission(FeaturePermission.STAFF)
  update(
    @Param('id') id: string,
    @Body() updateSystemuserDto: UpdateSystemuserDto,
    @CompanyId() companyId?: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    // Superadmins can update any system user (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    return this.systemuserService.update(+id, updateSystemuserDto, filterCompanyId, performedByUserId);
  }

  @Patch(':id/restore')
  async restore(
    @Param('id') id: string,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    const filterCompanyId =
      userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN
        ? undefined
        : (companyIdFromQuery || companyIdFromToken);
    return this.systemuserService.restore(+id, filterCompanyId, performedByUserId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  remove(@Param('id') id: string, @CompanyId() companyId?: string, @Req() req?: any) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    // Superadmins can delete any system user (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    return this.systemuserService.remove(+id, filterCompanyId, performedByUserId);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard)
  async permanentRemove(@Param('id') id: string, @CompanyId() companyId?: string, @Req() req?: any) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    return this.systemuserService.permanentDelete(+id, filterCompanyId, performedByUserId);
  }

  @Patch(':id/permissions')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  async assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
    @CompanyId() companyId?: string,
    @Req() req?: any,
  ) {
    // Get assigner's permissions and user ID from JWT to validate
    const assignerPermissions = req?.user?.permissions || [];
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    // Only SYSTEM_OWNER and SUPER_ADMIN can assign permissions to others
    // Regular users cannot modify permissions (even their own)
    if (userRole !== SystemUserRole.SYSTEM_OWNER && userRole !== SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
      throw new BadRequestException('Only System Owners and Super Admins can assign permissions');
    }
    // Superadmins can assign permissions to any system user (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    return this.systemuserService.assignPermissions(+id, dto.permissions, filterCompanyId, assignerPermissions, performedByUserId);
  }

  @Get(':id/permissions')
  @UseGuards(JwtAuthGuard)
  // @Permission(FeaturePermission.STAFF)
  async getPermissions(@Param('id') id: string, @CompanyId() companyId?: string, @Req() req?: any) {
    const performedByUserId = req?.user?.userId || req?.user?.sub;
    const userRole = req?.user?.role;
    // Only allow users to view their own permissions, unless they are SYSTEM_OWNER or SUPER_ADMIN
    if (userRole !== SystemUserRole.SYSTEM_OWNER && userRole !== SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
      if (performedByUserId !== +id) {
        throw new BadRequestException('You can only view your own permissions');
      }
    }
    // Superadmins can view permissions of any system user (ignore companyId filter)
    const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
    const user = await this.systemuserService.findOne(+id, filterCompanyId);
    return {
      statusCode: 200,
      data: {
        userId: user.id,
        permissions: user.permissions || [],
      },
    };
  }
}
