import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
     // let file_name =  MyFilesHelper.saveFoodImage(image);
      newFoodToCreate.imageUrl = "test image" + createFoodDto.name;
       savedNewFood =  await this.foodRepository.save(newFoodToCreate);
      if(createFoodDto.sizes && createFoodDto.sizes.length !=0 ) {
        createFoodDto.sizes.forEach(async _size => {
            await this.foodSizeService.create(savedNewFood , _size.size , _size.price);
        });        
        savedNewFood["sizes"] = createFoodDto.sizes;
      }
      return savedNewFood;

    } catch (error) {
      
      if(savedNewFood)
      await this.foodRepository.remove(savedNewFood)

      await MyFilesHelper.removeFoodImage(newFoodToCreate.imageUrl)
      MyExceptions.throwException('Something wrong while creating new food ' , error.message)
    }



  }

  async findAll() {
       try {
        let foods = await this.foodRepository.find({
          relations : {
            sizes : true
          } , 
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



  async update(id: number, updateFoodDto: UpdateFoodDto , image : Express.Multer.File) {
  let foodToUpdate = await this.findFoodByIdOrThrowException(id);  
  let newCategoryForThisFood = null;
  if(updateFoodDto.category_Id) {
    newCategoryForThisFood = await this.categoryService.findCategoryByIdOrThrowException(updateFoodDto.category_Id);
  }
  delete updateFoodDto.category_Id;
  Object.assign(foodToUpdate, updateFoodDto);
  if(newCategoryForThisFood) {
    foodToUpdate.Category = newCategoryForThisFood;
  }
  try {
    MyFilesHelper.updateFoodImage(image , foodToUpdate.imageUrl);
   return await this.foodRepository.save(foodToUpdate);   
  } catch (error) {
    MyExceptions.throwException('something wrong while updating food !'  , error.message);
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


}
