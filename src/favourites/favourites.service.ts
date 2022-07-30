import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/foods/entities/food.entity';
import { FoodsService } from 'src/foods/foods.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favourite } from './entities/favourite.entity';

@Injectable()
export class FavouritesService {


  constructor(@InjectRepository(Favourite) private favoriteRepository : Repository<Favourite> , 
   private userService : UsersService , 
   private foodService : FoodsService
  ) {}



  private async isThisFoodLikedByThisUser(food_Id: number , user_Id : number) : Promise<Favourite> {
    try {
      
      let likeRow = await this.favoriteRepository.findOne({where : {
        user : {
          id : user_Id
        } , 
        food : {
          id : food_Id
        }

      }});

      if(likeRow) {
        return likeRow;
      }

    } catch (error) {
      MyExceptions.throwException("something wrong while fetching favorites row" , error.message)
    }

    return null;
  } 

  async Like(createFavouriteDto: CreateFavouriteDto) {
    let user = await this.userService.findUserByIdOrThrowException(createFavouriteDto.user_Id)
    let food =await this.foodService.findFoodByIdOrThrowException(createFavouriteDto.food_Id);

    let likeRow= await this.isThisFoodLikedByThisUser(createFavouriteDto.food_Id , createFavouriteDto.user_Id);

    try {
      if(likeRow) {
          await this.favoriteRepository.remove(likeRow);
          return "disliked"
      }    else {
         let newLikeRow = this.favoriteRepository.create({user : user , food : food});
         await this.favoriteRepository.save(newLikeRow);
         return "liked"
      }
    } catch (error) {
      MyExceptions.throwException("something wrong while liking this product" , error.message)
    }
    
  }

  async findAllFavoritesOfUser(user_Id : number) {
 
 try {
   return  await this.favoriteRepository.find({where : {
     user : {
       id : +user_Id
     } , 
    } , 
   relations : {
    food : {
      sizes : true ,
    }
   }
  });
 } catch (error) {
   MyExceptions.throwException('something wrong while fetching favourites of this user' , error.message)
 }


  }


  remove(id: number) {

  }
}
