import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  get() {
    return {
      status: 'ok',
      env: process.env.NODE_ENV ?? 'unknown',
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }
}
