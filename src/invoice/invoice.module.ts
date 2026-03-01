import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './entities/invoice.entity';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { SystemuserModule } from '../systemuser/systemuser.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, SystemUser]),
    SystemuserModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
