import { Test, TestingModule } from '@nestjs/testing';
import { FoodSizeController } from './food_size.controller';
import { FoodSizeService } from './food_size.service';

describe('FoodSizeController', () => {
  let controller: FoodSizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodSizeController],
      providers: [FoodSizeService],
    }).compile();

    controller = module.get<FoodSizeController>(FoodSizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
