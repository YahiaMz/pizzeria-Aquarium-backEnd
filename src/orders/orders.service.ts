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

    console.log(cartItems);

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

    if (cartItems.length == 0)
      MyExceptions.throwException('you cant put this order !', 'empty cart');

    try {
      for (let x = 0; x < cartItems.length; x++) {
        let cartItem = cartItems[x];

        let newOrderItem = await this.orderItemsService.create(
          newOrder,
          cartItem.quantity,
          cartItem.food,
        );
        if (!newOrderItem) {
          await this.orderRepository.remove(newOrder);
          return false;
        }
        await this.cartService.removeThiItem(cartItem);
      }

      return true;
    } catch (error) {
      MyExceptions.throwException('please re-make your order !', error.message);
    }
  }

  async findAll() {
    try {
      let ordersForAdmin = await this.orderRepository.find({
        select: {
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
        select: {
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
