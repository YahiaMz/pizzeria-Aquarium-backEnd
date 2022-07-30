import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { Repository } from 'typeorm';
import { ChangeTheOrderStatusDto } from './dto/change-order-status.dto';
import { MakeOrderDto } from './dto/make-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private cartService: CartsService,
    private orderItemsService: OrderItemsService,
    private usersService: UsersService,
  ) {}

  async createJustOrder(user: User, address: string, phoneNumber: string) {
    try {
      let newOrder = this.orderRepository.create({
        user: user,
        address: address,
        phoneNumber: phoneNumber,
      });
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      return null;
    }
  }

  async MakeOrder(createOrderDto: MakeOrderDto) {
    let user = await this.usersService.findUserByIdOrThrowException(
      createOrderDto.user_Id,
    );
    let cartItems = await this.cartService.findCartItemsToMakeOrder(user.id);

if (cartItems.length == 0)
      MyExceptions.throwException('you cant put this order !', 'empty cart');


    let newOrder = await this.createJustOrder(
      user,
      createOrderDto.address,
      createOrderDto.orderPhoneNumber,
    );

    if (newOrder == null) {
      MyExceptions.throwException(
        'something wrong while putting the order !',
        'something wrong !',
      );
    }

    let newOrderWithTotalPrice = null;

    try {
      let totalPrice : number = 0;
      for (let x = 0; x < cartItems.length; x++) {
        let cartItem = cartItems[x];

        let orderItemPrice : number = cartItem.foodSize ? cartItem.foodSize.price : cartItem.food.price;
        totalPrice += orderItemPrice * cartItem.quantity;
        let newOrderItem = await this.orderItemsService.create(
          newOrder,
          cartItem.quantity,
          cartItem.food,
          cartItem.foodSize , 
          orderItemPrice * cartItem.quantity
        );
        if (!newOrderItem) {
          // removing the order if something wrong happen
          await this.orderRepository.remove(newOrder);
          return false;
        }

        await this.cartService.removeThiItem(cartItem);
      }
      newOrder.totalPrice = totalPrice;
       newOrderWithTotalPrice = await this.orderRepository.save(newOrder);
      return true;
    } catch (error) {
      if(newOrderWithTotalPrice == null) {
        await this.orderRepository.remove(newOrderWithTotalPrice);
      }
      MyExceptions.throwException('please re-make your order !', error.message);
    }
  }


  async findAll() {
    try {
      let ordersForAdmin = await this.orderRepository.find({
        select: {
          totalPrice:true ,
          id: true,
          address: true,
          phoneNumber: true,
          created_at: true,
          status: true,

          user: {
            id: true,
            name: true,
            imageProfileUrl: true,
            phoneNumber: true,
          },
          orderItems: {
            id: true,
            quantity: true,
            
            foodSize : {
              id : true , 
              price : true ,
              size : true
            } ,
            food: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
        relations: {
          orderItems: {
            foodSize : true ,
            food: true,
          },
          user: true,
        },
      });
      return ordersForAdmin;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }
  async findAllOrdersOfUser(user_Id: number) {
    let user = await this.usersService.findUserByIdOrThrowException(user_Id);

    try {
      let ordersForAdmin = await this.orderRepository.find({
        where: {
          user: {
            id: user_Id,
          },
        },
        order : {
          id : 'DESC'
        },
        select: {
          id: true,
          address: true,
          phoneNumber: true,
          created_at: true,
          status: true,
          totalPrice : true ,

          orderItems: {
            
            foodSize : {
              id :true , 
              price :true , 
              size :true ,
            } ,
            id: true,
            quantity: true,
            food: {
              id: true,
              name: true,
              price: true,

              imageUrl: true,
            },
          },
        },
        relations: {
          orderItems: {
            food: true,
            foodSize : true
          },
          user: true,
        },
      });
      return ordersForAdmin;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async changeOrderStatus(id: number, changeOrderStatusDto: ChangeTheOrderStatusDto) {
    let order = await this.findOrderByIdOrThrowException(id);
    try {
      order.status = +changeOrderStatusDto.newStatus;
    return  await this.orderRepository.save(order); 
    } catch (error) {
      MyExceptions.throwException('something wrong while updating status !', error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async findOrderByIdOrThrowException(order_Id: number): Promise<Order> {
    try {
      let order = await this.orderRepository.findOne({
        where: { id: order_Id },
      });
      if (order) return order;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }

    MyExceptions.throwException('order not found  !', null);
  }
}
