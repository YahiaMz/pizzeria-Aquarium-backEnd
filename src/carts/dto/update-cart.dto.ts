import { IsInt, IsPositive, Min } from "class-validator";

export class UpdateCartQuantityDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    quantity : number;
}