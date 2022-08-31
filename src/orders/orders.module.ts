import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { CartsModule } from 'src/carts/carts.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersGateWay } from './orders.gateway';

@Module({
  imports : [TypeOrmModule.forFeature([Orders]) ,UsersModule , CartsModule , OrderItemsModule ] , 
  controllers: [OrdersController],
  providers: [OrdersService  , OrdersGateWay] , 
  
})
export class OrdersModule {}
