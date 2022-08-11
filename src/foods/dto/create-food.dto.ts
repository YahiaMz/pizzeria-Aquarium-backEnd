import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CreateFoodSizeDto } from "src/food_size/dto/create-food_size.dto";

export class CreateFoodDto {

    @IsNumberString()
    category_Id : number; 

    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumberString()
    @IsOptional()
    price : number;

   @IsNumberString()
   @IsOptional()
   small_Size_price : number

   @IsNumberString()
   @IsOptional()
   medium_Size_price : number

   @IsNumberString()
   @IsOptional()
   large_Size_price : number


}
