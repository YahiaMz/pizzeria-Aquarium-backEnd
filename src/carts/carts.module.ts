import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { UsersModule } from 'src/users/users.module';
import { FoodsModule } from 'src/foods/foods.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { FoodSizeModule } from 'src/food_size/food_size.module';

@Module({
  imports : [UsersModule , FoodsModule , FoodSizeModule, TypeOrmModule.forFeature([Cart])], 
  controllers: [CartsController],
  providers: [CartsService] , 
  exports : [CartsService]
})
export class CartsModule {}
