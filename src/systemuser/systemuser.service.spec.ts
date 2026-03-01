import { Test, TestingModule } from '@nestjs/testing';
import { SystemuserService } from './systemuser.service';

describe('SystemuserService', () => {
  let service: SystemuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemuserService],
    }).compile();

    service = module.get<SystemuserService>(SystemuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
