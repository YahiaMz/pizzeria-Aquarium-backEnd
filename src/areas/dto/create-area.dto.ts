import { IsString, MinLength } from "class-validator";

export class CreateAreaDto {

    @IsString()
    @MinLength(3)
    area : string;

}
