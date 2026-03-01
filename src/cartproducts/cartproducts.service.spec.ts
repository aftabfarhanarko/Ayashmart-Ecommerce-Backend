import { Test, TestingModule } from '@nestjs/testing';
import { CartproductsService } from './cartproducts.service';

describe('CartproductsService', () => {
  let service: CartproductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartproductsService],
    }).compile();

    service = module.get<CartproductsService>(CartproductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
