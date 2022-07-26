import { Test, TestingModule } from '@nestjs/testing';
import { FoodSizeService } from './food_size.service';

describe('FoodSizeService', () => {
  let service: FoodSizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodSizeService],
    }).compile();

    service = module.get<FoodSizeService>(FoodSizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
