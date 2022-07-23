import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class UserLoginDto  {
 @IsString()
 phoneNumber : string;
 
 @IsString()
 password : string;
}
