import { IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateFoodDto {

    @IsNumberString()
    category_Id : number; 

    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumberString()
    price : number;

}
