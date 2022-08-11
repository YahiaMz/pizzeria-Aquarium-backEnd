import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAreaDto } from 'src/areas/dto/update-area.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { FoodSizeService } from 'src/food_size/food_size.service';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private foodRepository: Repository<Food>,
    private categoryService: CategoriesService, 
    private foodSizeService : FoodSizeService
  ) {}

  async create(createFoodDto: CreateFoodDto, image: Express.Multer.File) {
    let category = await this.categoryService.findCategoryByIdOrThrowException(
      createFoodDto.category_Id,
    );
    let newFoodToCreate = this.foodRepository.create({
      Category: category,
      name: createFoodDto.name,
      description: createFoodDto.description,
      price : createFoodDto.price
    });

  let savedNewFood = null;
    try {
      let file_name =  MyFilesHelper.saveFoodImage(image);
      newFoodToCreate.imageUrl = file_name;
       savedNewFood =  await this.foodRepository.save(newFoodToCreate);

      if(createFoodDto.small_Size_price ) {
        
            await this.foodSizeService.create(savedNewFood , "small" , +createFoodDto.small_Size_price);
            await this.foodSizeService.create(savedNewFood , "medium" , +createFoodDto.medium_Size_price);
            await this.foodSizeService.create(savedNewFood , "large" , +createFoodDto.large_Size_price);

      }
      return;

    } catch (error) {
      
      if(savedNewFood)
      await this.foodRepository.remove(savedNewFood)

      await MyFilesHelper.removeFoodImage(newFoodToCreate.imageUrl)
      MyExceptions.throwException('Something wrong while creating new food ' , error.message)
    }



  }

  async findAll(user_Id : number) {
       try {
        let foods = await this.foodRepository.find({
          relations : {
            sizes : true , 
            Category : true , 
          }  ,
          order : {
            sizes : {
              price : "ASC"
            }
          }
        });

          for(let x = 0 ; x < foods.length ; x ++) {
          
           let isLikedByThisUser = await this.foodRepository.query(`SELECT id from favourite f where f.user_Id = ${user_Id} and f.food_Id = ${foods[x].id} `)
          foods[x]['isLiked'] = isLikedByThisUser.length > 0
          }

        return foods;
       } catch (error) {
        MyExceptions.throwException('something wrong while fetching foods' , error.message)
       }  
  }


  async findAllFoodsForAdmin() {
    try {
     let foods = await this.foodRepository.find({
       relations : {
         sizes : true , 
         Category : true , 
       }  ,
       order : {
         sizes : {
           price : "ASC"
         }
       }
     });


     return foods;
    } catch (error) {
     MyExceptions.throwException('something wrong while fetching foods' , error.message)
    }  
}


async updateFood ( food : Food , updateFoodDto : UpdateFoodDto , image : Express.Multer.File ) {



  if(updateFoodDto.category_Id) {
  let category = await this.categoryService.findCategoryByIdOrThrowException(updateFoodDto.category_Id);
   food.Category = category;
  }
  
  if(updateFoodDto.name) {
    food.name = updateFoodDto.name
  }

  if(updateFoodDto.price)
  food.price = updateFoodDto.price

  if(updateFoodDto.description) 
  food.description = updateFoodDto.description;

  if(updateFoodDto.price) {
    food.price = updateFoodDto.price
  }

  try {


  await this.foodRepository.save(food);
  if(image)
    MyFilesHelper.updateFoodImage(image , food.imageUrl);

  return ;
} catch (error) {
  MyExceptions.throwException("name exist" , null)
  }
}


async updateFoodWithSizes ( food : Food , updateFoodDto : UpdateFoodDto , image : Express.Multer.File ) {

    let smallSize = food.sizes.find(item => item.size === "small")
    let mediumSize =food.sizes.find(item => item.size === "medium")
    let largeSize = food.sizes.find(item => item.size === "large")

    console.log(smallSize + " " + mediumSize + " " + largeSize);
    

    if(!smallSize || !mediumSize || !largeSize) {
      MyExceptions.throwException(" required sizes not found !" , "wrong input")
    }




    if(updateFoodDto.category_Id) {
    let category = await this.categoryService.findCategoryByIdOrThrowException(updateFoodDto.category_Id);
     food.Category = category;
    }
    
    if(updateFoodDto.name) {
      food.name = updateFoodDto.name
    }

    if(updateFoodDto.price)
    food.price = updateFoodDto.price

    if(updateFoodDto.description) 
    food.description = updateFoodDto.description;

    try {


    await this.foodRepository.save(food);
    if(image) {
    MyFilesHelper.updateFoodImage(image , food.imageUrl);    
    }
    let isSmallSizeUpdated = await this.foodSizeService.update(smallSize.id , updateFoodDto.small_Size_price );
    let isMediumSizeUpdated = await this.foodSizeService.update(mediumSize.id , updateFoodDto.medium_Size_price );
    let isLargeSizeUpdated = await this.foodSizeService.update(largeSize.id , updateFoodDto.large_Size_price );

    return ;
  } catch (error) {
    MyExceptions.throwException("name exist" , null)
    }
}



  async update(id: number, updateFoodDto: UpdateFoodDto , image : Express.Multer.File) {
  let foodToUpdate = await this.findFoodAndItSizesByIdOrThrowException(id);  
  

 if(updateFoodDto.small_Size_price != null) {
  await this.updateFoodWithSizes(foodToUpdate , updateFoodDto ,image)
 } else {
   await this.updateFood(foodToUpdate , updateFoodDto , image)
 }


  }

  async remove(id: number) {
   let foodToRemove = await this.findFoodByIdOrThrowException(id);
   try {
     
    await MyFilesHelper.removeFoodImage(foodToRemove.imageUrl) 
    await this.foodRepository.remove(foodToRemove);

   } catch (error) {
    await this.foodRepository.remove(foodToRemove);
    MyExceptions.throwException('something wrong while removing image' ,error.message);
   }
  }


  async findFoodByIdOrThrowException( id : number) {
    try {
      let food = await this.foodRepository.findOne({ where : {id : id} });
      if(food) {
        return food;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong while removing food' , error.message);
    
    }
    MyExceptions.throwException(' food not found !' , null);
  }


  async findFoodAndItSizesByIdOrThrowException( id : number) {
    try {
      let food = await this.foodRepository.findOne({ where : {id : id} , relations : {sizes : true} });
      if(food) {
        return food;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong while removing food' , error.message);
    
    }
    MyExceptions.throwException(' food not found !' , null);
  }


}
