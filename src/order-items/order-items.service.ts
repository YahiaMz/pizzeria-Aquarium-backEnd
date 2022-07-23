import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/foods/entities/food.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {

  constructor( @InjectRepository(OrderItem) private orderItemRepository : Repository<OrderItem>) {

  }

  async create(order : Order , quantity : number , food : Food) : Promise<boolean> {
    try {
      let newOrderItem = this.orderItemRepository.create({order : order , quantity : quantity , food : food})
      await this.orderItemRepository.save(newOrderItem);
      return true;
    } catch (error) {
      return false;
    }

  }


   createItem(order : Order , quantity : number , food : Food) {
    let newOrderItem = this.orderItemRepository.create({order : order , quantity : quantity , food : food})
return newOrderItem;
  }


}
