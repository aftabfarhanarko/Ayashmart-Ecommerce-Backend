import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreditNoteService } from './credit-note.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

/**
 * Controller for managing Credit Notes (Sales Returns)
 */
@Controller('credit-notes')
@UseGuards(JwtAuthGuard)
export class CreditNoteController {
  constructor(private readonly creditNoteService: CreditNoteService) {}

  /**
   * Create a new Credit Note
   * @param createCreditNoteDto Payload for creation
   */
  @Post()
  create(@Body() createCreditNoteDto: CreateCreditNoteDto) {
    return this.creditNoteService.create(createCreditNoteDto);
  }

  /**
   * Get all Credit Notes for a specific company
   * @param companyId Filter by companyId
   */
  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.creditNoteService.findAllByCompany(companyId);
  }

  /**
   * Get a single Credit Note by ID
   * @param id Individual Credit Note ID
   * @param companyId Company ID for security
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.creditNoteService.findOne(+id, companyId);
  }

  /**
   * Delete a Credit Note
   * @param id Individual Credit Note ID
   * @param companyId Company ID for security
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.creditNoteService.remove(+id, companyId);
  }
}
