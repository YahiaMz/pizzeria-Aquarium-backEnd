import { IsNumberString } from "class-validator";

export class ChangeFoodInCartSizeDto {

@IsNumberString()
cartItem_Id : number;

@IsNumberString()
size_Id : number;

}