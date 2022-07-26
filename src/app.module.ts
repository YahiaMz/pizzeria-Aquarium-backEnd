import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Food } from './foods/entities/food.entity';
import { FoodsModule } from './foods/foods.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { Orders } from './orders/entities/order.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { FoodSizeModule } from './food_size/food_size.module';
import { FoodSize } from './food_size/entities/food_size.entity';
import { FavouritesModule } from './favourites/favourites.module';
import { Favourite } from './favourites/entities/favourite.entity';
import { AreasModule } from './areas/areas.module';
import { Area } from './areas/entities/area.entity';
import { SlidesModule } from './slides/slides.module';
import { Slide } from './slides/entities/slide.entity';

const onLineDataBase = {
  type: 'mysql',
  host: 'containers-us-west-74.railway.app',
  port: 6182,
  username: 'root',
  password: 'wSH9iOfkYeuBqGifPYFe',
  database: 'railway',
};

const offlineLineDataBase = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'Yahia',
  password: 'AzerbB14916;',
  database: 'pizzeria_aquarium_db',
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'containers-us-west-74.railway.app',
      port: 6182,
      username: 'root',
      password: 'wSH9iOfkYeuBqGifPYFe',
      database: 'railway',
      entities: [
        Category,
        Food,
        User,
        Cart,
        Orders,
        OrderItem,
        FoodSize,
        Favourite,
        Area,
        Slide,
      ],
      synchronize: false,
    }),
    CategoriesModule,
    FoodsModule,
    UsersModule,
    CartsModule,
    OrdersModule,
    OrderItemsModule,
    FoodSizeModule,
    FavouritesModule,
    AreasModule,
    SlidesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
