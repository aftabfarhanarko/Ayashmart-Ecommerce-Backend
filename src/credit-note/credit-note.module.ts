import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditNoteController } from './credit-note.controller';
import { CreditNoteService } from './credit-note.service';
import { CreditNote } from './entities/credit-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditNote])],
  controllers: [CreditNoteController],
  providers: [CreditNoteService],
  exports: [CreditNoteService],
})
export class CreditNoteModule {}
