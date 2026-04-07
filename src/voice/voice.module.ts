import { Module, forwardRef } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { OrdersModule } from '../orders/orders.module';
// Force TS server update

@Module({
  imports: [forwardRef(() => OrdersModule)],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports: [VoiceService],
})
export class VoiceModule {}
