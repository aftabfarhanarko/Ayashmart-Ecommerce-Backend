import { Test, TestingModule } from '@nestjs/testing';
import { PromocodeController } from './promocode.controller';
import { PromocodeService } from './promocode.service';

describe('PromocodeController', () => {
  let controller: PromocodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromocodeController],
      providers: [PromocodeService],
    }).compile();

    controller = module.get<PromocodeController>(PromocodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
