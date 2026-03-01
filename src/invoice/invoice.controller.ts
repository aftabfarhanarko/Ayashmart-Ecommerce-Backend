import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InitiateBkashPaymentDto } from './dto/initiate-bkash-payment.dto';
import { BkashCallbackDto } from './dto/bkash-callback.dto';
import { BankPaymentDto } from './dto/bank-payment.dto';
import { RejectBankPaymentDto } from './dto/reject-bank-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('invoice')
// @UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string) {
    if (customerId) {
      return this.invoiceService.findByCustomer(+customerId);
    }
    return this.invoiceService.findAll();
  }

  @Get('number/:invoiceNumber')
  findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @Post('payment/bkash/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateBkashPayment(
    @Body() initiatePaymentDto: InitiateBkashPaymentDto,
  ) {
    return this.invoiceService.initiateBkashPayment(initiatePaymentDto);
  }

  @Post('payment/bkash/execute/:paymentID')
  @HttpCode(HttpStatus.OK)
  async executeBkashPayment(@Param('paymentID') paymentID: string) {
    return this.invoiceService.executeBkashPayment(paymentID);
  }

  @Post('payment/bkash/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  async bkashCallback(@Body() bkashCallbackDto: BkashCallbackDto) {
    return this.invoiceService.processBkashCallback(bkashCallbackDto);
  }

  @Get('payment/bkash/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  async bkashCallbackGet(@Query() query: BkashCallbackDto) {
    return this.invoiceService.processBkashCallback(query);
  }

  @Post('payment/bank')
  @HttpCode(HttpStatus.OK)
  async processBankPayment(@Body() bankPaymentDto: BankPaymentDto) {
    return this.invoiceService.processBankPayment(bankPaymentDto);
  }

  @Post('payment/bank/verify/:id')
  @HttpCode(HttpStatus.OK)
  async verifyBankPayment(@Param('id') id: string) {
    return this.invoiceService.verifyBankPayment(+id);
  }

  @Post('payment/bank/reject/:id')
  @HttpCode(HttpStatus.OK)
  async rejectBankPayment(
    @Param('id') id: string,
    @Body() rejectDto?: RejectBankPaymentDto,
  ) {
    return this.invoiceService.rejectBankPayment(+id, rejectDto?.reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
