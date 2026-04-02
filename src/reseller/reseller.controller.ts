import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
  HttpStatus,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { ResellerService } from './reseller.service';
import { SystemUserRole } from '../systemuser/system-user-role.enum';
import { RequestPayoutDto } from './dto/request-payout.dto';

@Controller('reseller')
@UseGuards(JwtAuthGuard)
export class ResellerController {
  constructor(private readonly resellerService: ResellerService) {}

  @Get('summary')
  async getSummary(@CompanyId() companyId: string, @Req() req: any) {
    const { userId, sub, role } = req.user || {};
    if (role !== SystemUserRole.RESELLER) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only resellers can access this endpoint',
      };
    }
    const resellerId = +(userId || sub);
    const data = await this.resellerService.getSummary(resellerId, companyId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('payouts')
  async listPayouts(@CompanyId() companyId: string, @Req() req: any) {
    const { userId, sub, role } = req.user || {};
    if (role !== SystemUserRole.RESELLER) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only resellers can access this endpoint',
      };
    }
    const resellerId = +(userId || sub);
    const data = await this.resellerService.listPayouts(resellerId, companyId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('payouts/:id/invoice')
  async getPayoutInvoice(
    @Param('id', ParseIntPipe) id: number,
    @CompanyId() companyId: string,
    @Req() req: any,
  ) {
    const { userId, sub, role } = req.user || {};
    if (role !== SystemUserRole.RESELLER) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only resellers can access payout invoice',
      };
    }
    const resellerId = +(userId || sub);
    const data = await this.resellerService.getPayoutInvoice(
      id,
      resellerId,
      companyId,
    );
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('payouts/request')
  async requestPayout(
    @CompanyId() companyId: string,
    @Req() req: any,
    @Body() body: RequestPayoutDto,
  ) {
    const { userId, sub, role } = req.user || {};
    if (role !== SystemUserRole.RESELLER) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only resellers can request payouts',
      };
    }
    const resellerId = +(userId || sub);
    const data = await this.resellerService.requestPayout(
      resellerId,
      companyId,
      body,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Payout request created',
      data,
    };
  }

  @Get('admin/resellers')
  async adminResellersList(@CompanyId() companyId: string, @Req() req: any) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can view resellers list',
      };
    }
    const data = await this.resellerService.adminResellersList(companyId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('admin/payouts')
  async adminListPayouts(@CompanyId() companyId: string, @Req() req: any) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can view payouts',
      };
    }
    const data = await this.resellerService.adminListPayouts(companyId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('admin/payouts/:id/invoice')
  async adminGetPayoutInvoice(
    @Param('id', ParseIntPipe) id: number,
    @CompanyId() companyId: string,
    @Req() req: any,
  ) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can access payout invoice',
      };
    }
    const data = await this.resellerService.adminGetPayoutInvoice(id, companyId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('admin/payouts/:id/mark-paid')
  async markPayoutPaid(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can mark payouts paid',
      };
    }
    const data = await this.resellerService.markPayoutPaid(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Payout marked as paid',
      data,
    };
  }

  @Post('admin/resellers/:id/approve')
  async approveReseller(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can approve resellers',
      };
    }
    const data = await this.resellerService.approveReseller(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Reseller approved',
      data,
    };
  }

  @Delete('admin/resellers/:id')
  async deleteReseller(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const { role } = req.user || {};
    if (
      role !== SystemUserRole.SYSTEM_OWNER &&
      role !== SystemUserRole.SUPER_ADMIN
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only system owners or super admins can delete resellers',
      };
    }
    const data = await this.resellerService.deleteReseller(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Reseller deleted',
      data,
    };
  }
}

