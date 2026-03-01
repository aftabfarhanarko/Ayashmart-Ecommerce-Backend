import { Test, TestingModule } from '@nestjs/testing';
import { RefundPolicyController } from './refund-policy.controller';
import { RefundPolicyService } from './refund-policy.service';

describe('RefundPolicyController', () => {
  let controller: RefundPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundPolicyController],
      providers: [RefundPolicyService],
    }).compile();

    controller = module.get<RefundPolicyController>(RefundPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
