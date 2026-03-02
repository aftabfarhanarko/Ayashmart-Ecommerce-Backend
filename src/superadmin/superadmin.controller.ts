import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { SuperadminLoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { WildcardDomainService } from '../common/services/wildcard-domain.service';

@Controller('superadmin')
// @UseGuards(JwtAuthGuard)
export class SuperadminController {
  constructor(
    private readonly superadminService: SuperadminService,
    private readonly wildcardDomainService: WildcardDomainService,
  ) {}

  @Post('login')
  // @Public()
  login(@Body() dto: SuperadminLoginDto) {
    return this.superadminService.login(dto);
  }

  /**
   * Trigger wildcard DNS setup: Cloudflare CNAME (*.console.innowavecart.app) + Railway domain.
   * Runs automatically on startup; can also be called manually for re-setup.
   */
  @Post('wildcard/setup')
  async setupWildcard() {
    const result = await this.wildcardDomainService.setupWildcard();
    return result;
  }

  @Post()
  create(@Body() createSuperadminDto: CreateSuperadminDto, @Req() req?: any) {

    return this.superadminService.create(createSuperadminDto);
  }

  @Get()
  findAll(@Req() req?: any) {
    // Only superadmins can view all superadmins
    // if (!req?.user) {
    //   throw new BadRequestException('User not authenticated');
    // }
    // const userRole = req.user.role;
    // if (userRole !== 'SUPER_ADMIN') {
    //   throw new BadRequestException('Access denied. Super Admin role required.');
    // }
    return this.superadminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req?: any) {
    // Auth/role checks are currently disabled for this controller,
    // so allow detail fetch without requiring req.user (similar to findAll).
    // TODO: Re-enable proper auth/role guard when JWT guard is restored.
    return this.superadminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuperadminDto: Partial<CreateSuperadminDto>, @Req() req?: any) {
    // if (!req?.user) {
    //   throw new BadRequestException('User not authenticated');
    // }
    // const userRole = req.user.role;
    // if (userRole !== 'SUPER_ADMIN') {
    //   throw new BadRequestException('Access denied. Super Admin role required.');
    // }
    return this.superadminService.update(+id, updateSuperadminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req?: any) {
    // Auth/role checks are currently disabled for this controller,
    // so allow delete without requiring req.user (similar to findAll).
    // TODO: Re-enable proper auth/role guard when JWT guard is restored.
    return this.superadminService.remove(+id);
  }
}
