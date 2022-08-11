import { IsIn, IsNumberString, Max, Min } from "class-validator";
import { In } from "typeorm";

export class ChangeTheOrderStatusDto {
    @IsNumberString()
    @IsIn(['1', '2' , '3' , '4' , '5'])
    newStatus : number;
}
