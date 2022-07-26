import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/foods/entities/food.entity';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { Repository } from 'typeorm';
import { CreateFoodSizeDto } from './dto/create-food_size.dto';
import { UpdateFoodSizeDto } from './dto/update-food_size.dto';
import { FoodSize } from './entities/food_size.entity';

@Injectable()
export class FoodSizeService {

  constructor( @InjectRepository(FoodSize) private foodSizeRepo : Repository<FoodSize>){

  }

  async create(food : Food , size : string , price : number) : Promise<FoodSize> {
      try {
        let newFoodSize =  this.foodSizeRepo.create({food : food , size : size , price : price});
        return  await this.foodSizeRepo.save(newFoodSize);
    
      } catch (error) {
        MyExceptions.throwException('something wrong while create food size ' , error.message)
      }
  }

   async findSizeByIdOrThrowException(id: number) {
  try {
    let foodSize = await this.foodSizeRepo.findOne({where : {id : id} , loadRelationIds : true});
        console.log(foodSize);
        

    if(foodSize) return foodSize;
  } catch (error) {
    MyExceptions.throwException('something wrong while finding this size' , error.message) 
  }
   MyExceptions.throwException('food size not found !', null);
    
  }

  update(id: number, updateFoodSizeDto: UpdateFoodSizeDto) {
    return `This action updates a #${id} foodSize`;
  }

 async remove(id: number)  {

    let size = await this.findSizeByIdOrThrowException(id);
    try {
      await this.foodSizeRepo.remove(size);
      return 
      
    } catch (error) {
      
    }
  }
}
