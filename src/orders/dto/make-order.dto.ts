import { IsNumberString, IsString, Length } from "class-validator";

export class MakeOrderDto {

@IsNumberString({})
user_Id : number; 

@IsString()
address  : string;

@IsString()
orderPhoneNumber : string;


}
