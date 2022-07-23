import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { equal } from 'assert';
import { identity } from 'rxjs';
import { Food } from 'src/foods/entities/food.entity';
import { FoodsService } from 'src/foods/foods.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { Equal, Repository } from 'typeorm';
import { AddFoodToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    private userService: UsersService,
    private foodService: FoodsService,
  ) {}

  async isThisFoodExistInThisCart(user_Id: number, food_Id: number) {
    try {
    //  let item = await this.cartRepository.query(`SELECT * FROM cart c where c.user_Id = ${user.id} and c.food_Id = ${food.id} `);
    let item = await this.cartRepository.findOne({where : {
      user : {
        id : user_Id, 
      } ,  
      food : {
        id : food_Id
      }
    }})  
    
    return item;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }

  async addToCart(addProductToCartDto: AddFoodToCartDto) {

    

    let user = await this.userService.findUserByIdOrThrowException(
      +addProductToCartDto.user_Id,
    );

    let food = await this.foodService.findFoodByIdOrThrowException(
      +addProductToCartDto.food_Id,
    );


  let item = await this.isThisFoodExistInThisCart(+user.id, +food.id);
  

    try {
      if (item) {
        if (((+addProductToCartDto.quantity) + (+item.quantity)) <= 0) {
          MyExceptions.throwException(
            'you cant decrease quantity util less then 1',
            null,
          );
        }
        item.quantity += +addProductToCartDto.quantity;
        return await this.cartRepository.save(item);
      } else {
        if (addProductToCartDto.quantity <= 0) {
          MyExceptions.throwException(
            'quantity must be positive to add new item to cart !',
            null,
          );
        }
        let newItem = this.cartRepository.create({
          food: food,
          user: user,
          quantity: addProductToCartDto.quantity,
        });
        return await this.cartRepository.save(newItem);
      }
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while adding item',
        error.message,
      );
    }
  }

  async findAllCartItemsOfUser(user_Id: number) {
    let mUser = await this.userService.findUserByIdOrThrowException(user_Id);

    try {
      let cartItems = await this.cartRepository.find({
        where : {
          user : {
            id : mUser.id
          } , 
        } , 
        select  : { 
          food : {
            id : true , 
            name : true , 
            price : true , 
            imageUrl : true,
          }
        },
        relations:{
          food : true , 
        } ,
      });
      return cartItems;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }


  async findCartItemsToMakeOrder(user_Id: number) : Promise<Cart[]> {
    try {
      let cartItems = await this.cartRepository.find({
        where : {
          user : {
            id : user_Id
          } , 
        } , 
        relations:{
          food : true , 
          user : true
        } ,
      });
    
      return cartItems;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }


  async remove(id: number) {
    let cartItem = await this.findCartByIdOrThrowException(id);
    try {
      await this.cartRepository.remove(cartItem);
      return;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while removing item !',
        error.message,
      );
    }
  }

  async removeThiItem(cartItem: Cart) {
    try {
      await this.cartRepository.remove(cartItem);
      return;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while removing item !',
        error.message,
      );
    }
  }

  public async findCartByIdOrThrowException(cartItemId: number) {
    try {
      let cartItem = await this.cartRepository.findOne({
        where: {
          id: cartItemId,
        },
      });
      if (cartItem) {
        return cartItem;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }

    MyExceptions.throwException('cart item not found !', null);
  }
}
