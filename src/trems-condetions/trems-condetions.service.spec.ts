import { Test, TestingModule } from '@nestjs/testing';
import { TremsCondetionsService } from './trems-condetions.service';

describe('TremsCondetionsService', () => {
  let service: TremsCondetionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TremsCondetionsService],
    }).compile();

    service = module.get<TremsCondetionsService>(TremsCondetionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
