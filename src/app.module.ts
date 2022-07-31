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
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { FoodSizeModule } from './food_size/food_size.module';
import { FoodSize } from './food_size/entities/food_size.entity';
import { FavouritesModule } from './favourites/favourites.module';
import { Favourite } from './favourites/entities/favourite.entity';



const onLineDataBase = {
  type: 'mysql',
  host: 'containers-us-west-79.railway.app',
  port: 5528,
  username: 'root',
  password: 'oukG1Dy2UWoB4gtWgIOo',
  database: 'railway',
}


const offlineLineDataBase = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'Yahia',
  password: 'AzerbB14916;',
  database: 'pizzeria_aquarium_db',
}


@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'containers-us-west-79.railway.app',
  port: 5528,
  username: 'root',
  password: 'oukG1Dy2UWoB4gtWgIOo',
  database: 'railway',
    entities: [Category , Food , User , Cart , Order , OrderItem , FoodSize , Favourite],
    synchronize: true,
  }),
    CategoriesModule,
    FoodsModule,
    UsersModule,
    CartsModule,
    OrdersModule,
    OrderItemsModule,
    FoodSizeModule,
    FavouritesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
