import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { FoodsService } from 'src/foods/foods.service';
import { FoodsModule } from 'src/foods/foods.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService] , 
  imports : [FoodsModule, UsersModule ,TypeOrmModule.forFeature([Favourite])]
})
export class FavouritesModule {}
