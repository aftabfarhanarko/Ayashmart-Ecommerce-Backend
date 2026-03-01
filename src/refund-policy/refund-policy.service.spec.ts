import { Test, TestingModule } from '@nestjs/testing';
import { RefundPolicyService } from './refund-policy.service';

describe('RefundPolicyService', () => {
  let service: RefundPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundPolicyService],
    }).compile();

    service = module.get<RefundPolicyService>(RefundPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
