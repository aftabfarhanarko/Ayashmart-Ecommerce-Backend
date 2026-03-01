import { Test, TestingModule } from '@nestjs/testing';
import { PrivecyPolicyService } from './privecy-policy.service';

describe('PrivecyPolicyService', () => {
  let service: PrivecyPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivecyPolicyService],
    }).compile();

    service = module.get<PrivecyPolicyService>(PrivecyPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
