import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { ReplyHelpDto } from './dto/reply-help.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('help')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Post()
  create(@Body() createHelpDto: CreateHelpDto, @CompanyId() companyId?: string) {
    return this.helpService.create(createHelpDto, companyId);
  }

  @Get()
  findAll(@CompanyId() companyId?: string) {
    return this.helpService.findAll(companyId);
  }

  @Get('stats')
  getStats(@CompanyId() companyId?: string) {
    return this.helpService.getStats(companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId?: string) {
    return this.helpService.findOne(id, companyId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHelpDto: UpdateHelpDto, @CompanyId() companyId?: string) {
    return this.helpService.update(id, updateHelpDto, companyId);
  }

  @Post(':id/reply')
  addReply(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyDto: ReplyHelpDto,
    @CompanyId() companyId?: string,
  ) {
    return this.helpService.addReply(id, replyDto, companyId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId?: string) {
    return this.helpService.remove(id, companyId);
  }
}
