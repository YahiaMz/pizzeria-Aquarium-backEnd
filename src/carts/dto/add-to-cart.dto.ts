import { IsNumberString, IsPositive, Min, } from "class-validator";

export class AddFoodToCartDto {

    @IsNumberString() 
    user_Id : number;

    @IsNumberString() 
    food_Id : number;

    @IsNumberString() 
    quantity : number;
    

}