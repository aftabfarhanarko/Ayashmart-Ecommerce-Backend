import { Test, TestingModule } from '@nestjs/testing';
import { FraudcheckerService } from './fraudchecker.service';

describe('FraudcheckerService', () => {
  let service: FraudcheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraudcheckerService],
    }).compile();

    service = module.get<FraudcheckerService>(FraudcheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
