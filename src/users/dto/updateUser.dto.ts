import { IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateUserDto {



    @IsString()
    name : string;
    
    @IsOptional()
    @IsString()
    lastName : String;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password : string;

    @IsOptional()
    @IsString()
    @Length(10)
    phoneNumber : string;
    

}