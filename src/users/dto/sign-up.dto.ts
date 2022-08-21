import { IsString, Length, Min, min, MinLength } from "class-validator";

export class SignUpUserDto {

    @IsString()
    @Length(10)
    phoneNumber : string;

    @IsString()
    @MinLength(4)
    password : string;

}
