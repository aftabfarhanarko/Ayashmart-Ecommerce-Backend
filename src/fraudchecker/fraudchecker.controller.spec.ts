import { Test, TestingModule } from '@nestjs/testing';
import { FraudcheckerController } from './fraudchecker.controller';
import { FraudcheckerService } from './fraudchecker.service';

describe('FraudcheckerController', () => {
  let controller: FraudcheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraudcheckerController],
      providers: [FraudcheckerService],
    }).compile();

    controller = module.get<FraudcheckerController>(FraudcheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
