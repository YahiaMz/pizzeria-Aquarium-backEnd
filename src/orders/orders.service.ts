import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MyExceptions } from 'src/Utils/MyExceptions';
import {  LessThan, Repository } from 'typeorm';
import { ChangeTheOrderStatusDto } from './dto/change-order-status.dto';
import { MakeOrderDto } from './dto/make-order.dto';
import { Order } from './entities/order.entity';
import { OrdersGateWay } from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private cartService: CartsService,
    private orderItemsService: OrderItemsService,
    private usersService: UsersService,
    private ordersGateway : OrdersGateWay
  ) {}

  async createJustOrder(user: User, address: string, phoneNumber: string , area : string ) {
    try {
      let newOrder = this.orderRepository.create({
        user: user,
        address: address,
        phoneNumber: phoneNumber,
        area : area
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
      createOrderDto.area
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
      let orderItems = []
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
        orderItems.push(newOrderItem);

        if (!newOrderItem) {
          // removing the order if something wrong happen
          await this.orderRepository.remove(newOrder);
          return false;
        }

        await this.cartService.removeThiItem(cartItem);
      }
      
      newOrder.totalPrice = totalPrice;
  
       newOrderWithTotalPrice = await this.orderRepository.save(newOrder);
       newOrderWithTotalPrice["items"] = orderItems;
       this.ordersGateway.mServer.emit("new-order" , newOrderWithTotalPrice)
      
      
      return true;

    } catch (error) {
      if(newOrderWithTotalPrice == null) {
        await this.orderRepository.remove(newOrderWithTotalPrice);
      }
      MyExceptions.throwException('please re-place your order !', error.message);
    }
  }






  async findAll( ) {
    try {

      let dateNow =new Date(Date.now());

    
    
      let ordersForAdmin = await this.orderRepository.find({
        order : {
          id : "DESC"
        }, 
        select: {
          
          totalPrice:true ,
          id: true,
          address: true,
          phoneNumber: true,
          created_at: true,
          status: true,
          area : true ,

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


    let ordersOfToday = [];
    for (let x = 0 ; x < ordersForAdmin.length ; x++) {

      let createdAtDate = new Date(ordersForAdmin[x].created_at)
      let dateNow = new Date(Date.now());



      if((dateNow.valueOf() - createdAtDate.valueOf()) <= 5 * 3600000 ) {
        ordersOfToday.push(ordersForAdmin[x]);        
      }

    }


      return ordersOfToday;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }





  async findAllOrdersOfUser(user_Id: number) {
    let user = await this.usersService.findUserByIdOrThrowException(user_Id);

    try {
      let ordersOfUser = await this.orderRepository.find({
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
          area : true ,
          created_at: true,
          status: true,
          isReceived : true ,
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

      let ordersOfToday = [];
      for (let x = 0 ; x < ordersOfUser.length ; x++) {
  
        let createdAtDate = new Date(ordersOfUser[x].created_at)
        let dateNow =new Date(Date.now());
      

        let oneDayIn_ms =   3600000 * 24;   

        if( dateNow.valueOf( ) - createdAtDate.valueOf( ) <=  oneDayIn_ms ) {
              
          ordersOfToday.push(ordersOfUser[x]);        
        }
  
      }

      return ordersOfToday;
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
      console.log(error.message);
      
    }
  }


  async OrderReceived(id: number) {
    let order = await this.findOrderByIdOrThrowException(id);
    try {
      order.status = 4;
      order.isReceived = true;
      await this.orderRepository.save(order); 
      return
    } catch (error) {
      MyExceptions.throwException('something wrong while updating status !', error.message);
      console.log(error.message);
      
    }
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
