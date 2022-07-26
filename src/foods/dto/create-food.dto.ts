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

    @IsOptional()
    @IsArray()
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    @ValidateNested({ each: true })
    @Type(()=> CreateFoodSizeDto )
    sizes : CreateFoodSizeDto[]

}
