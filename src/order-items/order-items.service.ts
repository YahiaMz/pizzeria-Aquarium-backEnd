import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/foods/entities/food.entity';
import { FoodSize } from 'src/food_size/entities/food_size.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {

  constructor( @InjectRepository(OrderItem) private orderItemRepository : Repository<OrderItem>) {

  }

  async create(order : Orders , quantity : number , food : Food , foodSize : FoodSize , itemPrice : number) {
    try {
      let newOrderItem = this.orderItemRepository.create({order : order , quantity : quantity , food : food , foodSize : foodSize , itemPrice : itemPrice})
      let newItem =  await this.orderItemRepository.save(newOrderItem);
      delete newOrderItem.order;
      return newItem;
    
    } catch (error) {
      return false;
    }


  }


   createItem(order : Orders , quantity : number , food : Food) {
    let newOrderItem = this.orderItemRepository.create({order : order , quantity : quantity , food : food})
     return newOrderItem;
  }


}
