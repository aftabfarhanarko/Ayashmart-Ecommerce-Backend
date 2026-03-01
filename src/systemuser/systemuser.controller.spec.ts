import { Test, TestingModule } from '@nestjs/testing';
import { SystemuserController } from './systemuser.controller';
import { SystemuserService } from './systemuser.service';

describe('SystemuserController', () => {
  let controller: SystemuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemuserController],
      providers: [SystemuserService],
    }).compile();

    controller = module.get<SystemuserController>(SystemuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
