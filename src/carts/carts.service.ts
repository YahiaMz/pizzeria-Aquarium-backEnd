import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { equal } from 'assert';
import { identity } from 'rxjs';
import { Food } from 'src/foods/entities/food.entity';
import { FoodsService } from 'src/foods/foods.service';
import { FoodSizeService } from 'src/food_size/food_size.service';
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
    private foodSizeService: FoodSizeService,

  ) {}

  async isThisFoodExistInThisCart(user_Id: number, food_Id: number , size_Id : number) {
    try {
    //  let item = await this.cartRepository.query(`SELECT * FROM cart c where c.user_Id = ${user.id} and c.food_Id = ${food.id} `);
    let item = await this.cartRepository.findOne({where : {
      user : {
        id : user_Id, 
      } ,  
      food : {
        id : food_Id
      },
      foodSize: {
        id : size_Id
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

    let foodSize = null;
    if(addProductToCartDto.size_Id != null) {

      foodSize = await this.foodSizeService.findSizeByIdOrThrowException(addProductToCartDto.size_Id);
      if(foodSize && foodSize.food != addProductToCartDto.food_Id) {
        MyExceptions.throwException('food size does not match this cart food item', null) ;    
     }
 
    }else {
      if(food.price == null) {
        MyExceptions.throwException('you have to select a size', null) ;     
      }

    }
 
    
  let item = await this.isThisFoodExistInThisCart(+user.id, +food.id ,addProductToCartDto.size_Id );
  

    try {
      if (item) {
        if (((+addProductToCartDto.quantity) + (+item.quantity)) <= 0) {
          MyExceptions.throwException(
            'you cant decrease quantity util less then 1',
            null,
          );
        }
        item.quantity += +addProductToCartDto.quantity;
         await this.cartRepository.save(item);
        return "item quantity changed"
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
          foodSize : foodSize,
          quantity: addProductToCartDto.quantity,
        });
        await this.cartRepository.save(newItem);
      
      return "item added"

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
        order :{
          id : "ASC" ,
          food : {
            sizes : {
              price : "ASC"
            }
          }
        } ,
        relations:{
          food : {
            sizes : true , 
          } , 
          foodSize : true
        } ,
      });
      return cartItems;
    } catch (error) {
      MyExceptions.throwException('something wrong !', error.message);
    }
  }



  // this function is for increasing and decreasing quantity of cart item
  async addThisQuantityToCartItem ( itemId : number , newQuantity : number ) {
let cartItem = await this.findCartByIdOrThrowException(itemId  );

if(cartItem.quantity+newQuantity <= 0) {
  MyExceptions.throwException('wrong operation' , "you cant change quantity until <= 0");
}

 try {
    cartItem.quantity += newQuantity;
    return await this.cartRepository.save(cartItem);
    
 } catch (error) {
  MyExceptions.throwException('something wrong while changing the quantity' , error.message);
 }

  }

  async changeCartItemSize ( itemId : number , size_Id : number ) {
    let cartItem = await this.findCartAndItFoodIdByIdOrThrowException(itemId)
    let newSize = await this.foodSizeService.findSizeByIdOrThrowException(size_Id );
    

    console.log(cartItem);
    console.log(newSize);
    
    
    if(+cartItem.food !== +cartItem.food) {
       MyExceptions.throwException('this food size is not a size of this food' , null)
    }



    

    try {
        cartItem.foodSize = newSize;
        return (await this.cartRepository.save(cartItem)).foodSize;
        
     } catch (error) {
      MyExceptions.throwException('something wrong while changing the size' , error.message);
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
          user : true , 
          foodSize : true
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

  public async findCartAndItFoodIdByIdOrThrowException(cartItemId: number) {
    try {
      let cartItem = await this.cartRepository.findOne({
        where: {
          id: cartItemId,
        },
        loadRelationIds : true  

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
