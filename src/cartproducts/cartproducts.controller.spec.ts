import { Test, TestingModule } from '@nestjs/testing';
import { CartproductsController } from './cartproducts.controller';
import { CartproductsService } from './cartproducts.service';

describe('CartproductsController', () => {
  let controller: CartproductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartproductsController],
      providers: [CartproductsService],
    }).compile();

    controller = module.get<CartproductsController>(CartproductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
