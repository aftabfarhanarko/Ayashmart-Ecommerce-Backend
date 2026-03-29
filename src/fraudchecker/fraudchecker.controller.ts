import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, ParseIntPipe, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { FraudcheckerService } from './fraudchecker.service';
import { CreateFraudcheckerDto } from './dto/create-fraudchecker.dto';
import { UpdateFraudcheckerDto } from './dto/update-fraudchecker.dto';
import { BanUserDto } from '../users/dto/ban-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';

@Controller('fraudchecker')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class FraudcheckerController {
  constructor(private readonly fraudcheckerService: FraudcheckerService) {}

  @Get('users/check')
  @HttpCode(HttpStatus.OK)
  async check(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ) {
    const provided = [email, name, phone].filter((v) => v && v.trim() !== '');
    if (provided.length !== 1) {
      throw new BadRequestException('Provide exactly one of email, name, or phone');
    }

    if (email) {
      const risk = await this.fraudcheckerService.checkUserRiskByEmail(email);
      return { statusCode: HttpStatus.OK, message: 'User risk evaluated by email', data: risk };
    }

    if (phone) {
      const risk = await this.fraudcheckerService.checkUserRiskByPhone(phone);
      return { statusCode: HttpStatus.OK, message: 'User risk evaluated by phone', data: risk };
    }

    const risks = await this.fraudcheckerService.checkUserRiskByName(name!);
    return { statusCode: HttpStatus.OK, message: 'Users risk evaluated by name', data: risks };
  }

  @Patch('users/:id/flag')
  @HttpCode(HttpStatus.OK)
  async flagUser(@Param('id', ParseIntPipe) id: number, @Body() dto: BanUserDto) {
    const banned = await this.fraudcheckerService.flagUser(id, dto?.reason);
    return { statusCode: HttpStatus.OK, message: 'User flagged (banned)', data: banned };
  }

  @Patch('users/:id/unflag')
  @HttpCode(HttpStatus.OK)
  async unflagUser(@Param('id', ParseIntPipe) id: number) {
    const unbanned = await this.fraudcheckerService.unflagUser(id);
    return { statusCode: HttpStatus.OK, message: 'User unflagged (unbanned)', data: unbanned };
  }

  @Get('external/check')
  @HttpCode(HttpStatus.OK)
  async checkExternal(@Query('phone') phone?: string) {
    if (!phone || phone.trim() === '') {
      throw new BadRequestException('phone query parameter is required');
    }
    const result = await this.fraudcheckerService.checkByPhoneExternal(phone.trim());
    return { statusCode: HttpStatus.OK, message: 'External fraud check completed', data: result };
  }
}
