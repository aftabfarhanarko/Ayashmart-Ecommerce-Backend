import { Test, TestingModule } from '@nestjs/testing';
import { PrivecyPolicyController } from './privecy-policy.controller';
import { PrivecyPolicyService } from './privecy-policy.service';

describe('PrivecyPolicyController', () => {
  let controller: PrivecyPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivecyPolicyController],
      providers: [PrivecyPolicyService],
    }).compile();

    controller = module.get<PrivecyPolicyController>(PrivecyPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
