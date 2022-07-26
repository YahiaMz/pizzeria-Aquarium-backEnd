import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodSize } from './entities/food_size.entity';
import { FoodSizeService } from './food_size.service';

@Module({
  imports : [TypeOrmModule.forFeature([FoodSize])] ,
  providers: [FoodSizeService] , 
  exports :[FoodSizeService]
})
export class FoodSizeModule {}
