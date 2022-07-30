import { IsNumberString } from "class-validator";

export class CreateFavouriteDto {

    @IsNumberString()
    user_Id : number;


    @IsNumberString()
    food_Id : number;



}
