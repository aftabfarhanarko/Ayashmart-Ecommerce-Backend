import { Module } from '@nestjs/common';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { HelpSupportGateway } from './help-support.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from './entities/help.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Help])],
  controllers: [HelpController],
  providers: [HelpService, HelpSupportGateway],
  exports: [HelpService],
})
export class HelpModule {}
