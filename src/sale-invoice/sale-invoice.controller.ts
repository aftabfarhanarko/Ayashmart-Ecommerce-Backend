import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { SaleInvoiceService } from './sale-invoice.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Sale Invoices')
@Controller('sale-invoices')
export class SaleInvoiceController {
  constructor(private readonly saleInvoiceService: SaleInvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale invoice' })
  create(@Body() createSaleInvoiceDto: CreateSaleInvoiceDto, @Query('companyId') companyId: string) {
    return this.saleInvoiceService.create(createSaleInvoiceDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sale invoices for the company' })
  @ApiQuery({ name: 'companyId', required: true })
  findAll(@Query('companyId') companyId: string) {
    return this.saleInvoiceService.findAll(companyId);
  }

  @Post(':id/send-email')
  @ApiOperation({ summary: 'Send invoice as PDF to customer email' })
  @ApiQuery({ name: 'companyId', required: true })
  async sendEmail(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Body() body: { pdfBase64: string },
  ) {
    return this.saleInvoiceService.sendEmail(+id, companyId, body.pdfBase64);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific sale invoice' })
  @ApiQuery({ name: 'companyId', required: true })
  findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.saleInvoiceService.findOne(+id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sale invoice (status, delivery, fulfillment)' })
  @ApiQuery({ name: 'companyId', required: true })
  update(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Body() updateDto: UpdateSaleInvoiceDto,
  ) {
    return this.saleInvoiceService.update(+id, companyId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale invoice' })
  @ApiQuery({ name: 'companyId', required: true })
  remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.saleInvoiceService.remove(+id, companyId);
  }

  @Post(':id/revert')
  @ApiOperation({ summary: 'Revert (cancel) a sale invoice' })
  @ApiQuery({ name: 'companyId', required: true })
  revert(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.saleInvoiceService.revert(+id, companyId);
  }
}
