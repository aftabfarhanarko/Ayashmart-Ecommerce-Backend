import { Body, Controller, ForbiddenException, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SettingService } from './setting.service';
import { UpdateSmtpDto } from './dto/update-smtp.dto';

const SUPERADMIN_SMTP_COMPANY_ID = '__SUPERADMIN_SMTP__';

@Controller('superadmin/setting')
@UseGuards(JwtAuthGuard)
export class SuperadminSettingController {
  constructor(private readonly settingService: SettingService) {}

  private assertSuperAdmin(req?: any) {
    const role = req?.user?.role;
    if (role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied');
    }
  }

  @Get('smtp')
  async getSmtp(@Req() req?: any) {
    this.assertSuperAdmin(req);
    try {
      const data = await this.settingService.findFirstByCompanyId(
        SUPERADMIN_SMTP_COMPANY_ID,
      );
      return { status: 'success', message: 'SMTP fetched successfully', data };
    } catch {
      return { status: 'success', message: 'SMTP fetched successfully', data: null };
    }
  }

  @Patch('smtp')
  async upsertSmtp(@Body() dto: UpdateSmtpDto, @Req() req?: any) {
    this.assertSuperAdmin(req);
    const data = await this.settingService.upsertSmtp(
      SUPERADMIN_SMTP_COMPANY_ID,
      dto,
    );
    return { status: 'success', message: 'SMTP updated successfully', data };
  }
}

