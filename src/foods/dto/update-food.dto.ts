import { PartialType } from '@nestjs/mapped-types';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto {
    @IsOptional()
    @IsNumberString()
    category_Id : number; 

    @IsString()
    @IsOptional()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumberString()
    @IsOptional()
    price : number;

   @IsNumberString()
   @IsOptional()
   small_size_price : number

   @IsNumberString()
   @IsOptional()
   medium_size_price : number

   @IsNumberString()
   @IsOptional()
   large_size_price : number
}
