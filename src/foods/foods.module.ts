import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import {CategoriesModule} from '../categories/categories.module'
import { FoodSizeModule } from 'src/food_size/food_size.module';

@Module({
  imports : [ TypeOrmModule.forFeature([Food]) , CategoriesModule , FoodSizeModule], 
  controllers: [FoodsController , ],
  providers: [FoodsService] , 
  exports : [FoodsService]
})
export class FoodsModule {}
