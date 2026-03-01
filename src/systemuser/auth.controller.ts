import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { SystemuserService } from './systemuser.service';
import { SuperadminService } from '../superadmin/superadmin.service';
import { LoginDto } from './dto/login.dto';
import { SuperadminLoginDto } from '../superadmin/dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateSystemuserDto } from './dto/update-systemuser.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly systemuserService: SystemuserService,
    private readonly superadminService: SuperadminService,
  ) {}

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.systemuserService.login(dto);
  }

  @Post('superadmin/login')
  @Public()
  superadminLogin(@Body() dto: SuperadminLoginDto) {
    return this.superadminService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    const userId = req.user?.userId || req.user?.sub;
    const userRole = req.user?.role;
    
    // Validate userId is a valid number
    if (!userId || isNaN(Number(userId))) {
      return {
        success: false,
        message: 'User not found - invalid user ID',
      };
    }

    const userIdNumber = Number(userId);

    // If user is SUPER_ADMIN, fetch from superadmin service
    if (userRole === 'SUPER_ADMIN') {
      const superadmin = await this.superadminService.findOne(userIdNumber);
      return {
        success: true,
        data: superadmin,
      };
    }

    // Otherwise, fetch from systemuser service
    const user = await this.systemuserService.findOne(userIdNumber);
    
    return {
      success: true,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(
    @Request() req,
    @Body() dto: UpdateSystemuserDto,
  ) {
    const userId = req.user?.userId || req.user?.sub;

    if (!userId || isNaN(Number(userId))) {
      return {
        success: false,
        message: 'User not found - invalid user ID',
      };
    }

    const updated = await this.systemuserService.update(Number(userId), dto);

    return {
      success: true,
      data: updated,
    };
  }

  @Post('forget-password')
  @Public()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.systemuserService.forgotPassword(dto);
  }

  @Post('forget-password/:userId/:token')
  @Public()
  resetPassword(
    @Param('userId') userId: string,
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto
  ) {
    return this.systemuserService.resetPassword(+userId, token, dto);
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      return {
        success: false,
        message: 'Refresh token is required',
      };
    }

    try {
      const tokens = await this.systemuserService.refreshToken(body.refreshToken);
      return {
        success: true,
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to refresh token',
      };
    }
  }
}
