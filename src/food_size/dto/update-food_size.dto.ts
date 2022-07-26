import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodSizeDto } from './create-food_size.dto';

export class UpdateFoodSizeDto extends PartialType(CreateFoodSizeDto) {}
