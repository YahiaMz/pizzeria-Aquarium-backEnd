import { IsString, MinLength } from 'class-validator';

export class UpdateAreaDto{
    @IsString()
    @MinLength(3)
    area : string;

}
