import { Test, TestingModule } from '@nestjs/testing';
import { TremsCondetionsController } from './trems-condetions.controller';
import { TremsCondetionsService } from './trems-condetions.service';

describe('TremsCondetionsController', () => {
  let controller: TremsCondetionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TremsCondetionsController],
      providers: [TremsCondetionsService],
    }).compile();

    controller = module.get<TremsCondetionsController>(TremsCondetionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
