import { IsNumberString, IsString } from "class-validator";

export class CreateFoodSizeDto {

    @IsString()
    size : string;

    @IsNumberString()
    price : number;

}
