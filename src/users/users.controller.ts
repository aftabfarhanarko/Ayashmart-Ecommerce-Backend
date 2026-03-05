// UsersController
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, HttpCode, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { LoginDto } from './dto/login.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';

import { Public } from '../common/decorators/public.decorator';

@Controller('users')
// @UseGuards(CompanyIdGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: CreateUserDto & { companyId?: string },
    @Query('companyId') companyIdFromQuery?: string,
  ) {
    const companyId = body.companyId || companyIdFromQuery;
    const { companyId: _ignored, ...createUserDto } = body;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }
    const user = await this.usersService.create(createUserDto, companyId);

    // Auto-login: generate access token for the newly registered user
    let accessToken: string | undefined;
    let safeUser: any = user;
    try {
      const loginResult = await this.usersService.login(
        createUserDto.email,
        createUserDto.password,
        companyId,
      );
      accessToken = loginResult.accessToken;
      safeUser = loginResult.user;
    } catch (e) {
      // If auto-login fails, we still return successful registration
      console.error('Auto-login after register failed:', e);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: user,
      ...(accessToken && safeUser ? { accessToken, user: safeUser } : {}),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { accessToken, user } = await this.usersService.login(
      loginDto.email,
      loginDto.password,
      loginDto.companyId
    );
    return { statusCode: HttpStatus.OK, message: 'Login successful', accessToken, user };
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: ForgotPasswordDto & { companyId?: string },
    @Query('companyId') companyIdFromQuery?: string,
  ) {
    const companyId = body.companyId || companyIdFromQuery;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    const result = await this.usersService.requestPasswordReset(body.email, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: { success: result.success, message: result.message },
    };
  }

  @Post('reset-password/:userId/:token')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('token') token: string,
    @Body() body: ResetPasswordDto & { companyId?: string },
    @Query('companyId') companyIdFromQuery?: string,
  ) {
    const companyId = body.companyId || companyIdFromQuery;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    const result = await this.usersService.resetPassword(
      userId,
      token,
      body.password,
      body.confirmPassword,
      companyId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result,
    };
  }

  // Public endpoint for initial password setup for guest-created accounts
  @Post('initial-set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async initialSetPassword(
    @Body() body: { email: string; password: string; confirmPassword: string; orderId?: number; companyId?: string },
    @Query('companyId') companyIdFromQuery?: string,
  ) {
    const companyId = body.companyId || companyIdFromQuery;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    const result = await this.usersService.initialSetPassword({
      email: body.email,
      companyId,
      password: body.password,
      confirmPassword: body.confirmPassword,
      orderId: body.orderId,
    });
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result,
    };
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateUserDto & { companyId?: string },
    @Query('companyId') companyIdFromQuery?: string,
  ) {
    const companyId = body.companyId || companyIdFromQuery;
    const { companyId: _ignored, ...createUserDto } = body;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }

    const user = await this.usersService.create(createUserDto, companyId);

    // Auto-login when password is provided (e.g. customer self-registration)
    let accessToken: string | undefined;
    let safeUser: any = user;
    if (createUserDto.password) {
      try {
        const loginResult = await this.usersService.login(
          createUserDto.email,
          createUserDto.password,
          companyId,
        );
        accessToken = loginResult.accessToken;
        safeUser = loginResult.user;
      } catch (e) {
        console.error('Auto-login after user create failed:', e);
      }
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created',
      data: user,
      ...(accessToken && safeUser ? { accessToken, user: safeUser } : {}),
    };
  }

  /** Returns current customer from tbl_users only (storefront). Use /auth/me for systemuser. */
  @Get('me')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@UserId() userId: number, @CompanyId() companyId: string) {
    const user = await this.usersService.findOne(userId, companyId);
    return { statusCode: HttpStatus.OK, message: 'Current user fetched', data: user };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(@UserId() userId: number, @Body() updateUserDto: UpdateUserDto, @CompanyId() companyId: string) {
    const updated = await this.usersService.update(userId, updateUserDto, companyId);
    return { statusCode: HttpStatus.OK, message: 'Profile updated', data: updated };
  }

  @Get()
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@CompanyId() companyId: string, @Query() query: QueryUsersDto) {
    const filters: { isBanned?: boolean; isActive?: boolean; successfulOrders?: 'has' | 'none'; cancelledOrders?: 'has' | 'none' } = {};
    if (query.isBanned !== undefined) filters.isBanned = query.isBanned === 'true';
    if (query.isActive !== undefined) filters.isActive = query.isActive === 'true';
    if (query.successfulOrders) filters.successfulOrders = query.successfulOrders;
    if (query.cancelledOrders) filters.cancelledOrders = query.cancelledOrders;
    const users = await this.usersService.findAll(companyId, Object.keys(filters).length ? filters : undefined);
    return { statusCode: HttpStatus.OK, message: 'Users list fetched', data: users };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const user = await this.usersService.findOne(id, companyId);
    return { statusCode: HttpStatus.OK, message: 'User fetched', data: user };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @CompanyId() companyId: string) {
    const updated = await this.usersService.update(id, updateUserDto, companyId);
    return { statusCode: HttpStatus.OK, message: 'User updated', data: updated };
  }

  // Add ban/unban endpoints
  @Patch(':id/ban')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async ban(@Param('id', ParseIntPipe) id: number, @Body() dto: BanUserDto, @CompanyId() companyId: string) {
    const banned = await this.usersService.ban(id, companyId, dto?.reason);
    return { statusCode: HttpStatus.OK, message: 'User banned', data: banned };
  }

  @Patch(':id/unban')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async unban(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const unbanned = await this.usersService.unban(id, companyId);
    return { statusCode: HttpStatus.OK, message: 'User unbanned', data: unbanned };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CompanyIdGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    await this.usersService.remove(id, companyId);
    return { statusCode: HttpStatus.OK, message: 'User removed' };
  }
}
