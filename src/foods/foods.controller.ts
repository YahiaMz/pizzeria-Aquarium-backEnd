import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { join } from 'path';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createFoodDto: CreateFoodDto , @UploadedFile() image : Express.Multer.File) {

    let foodHasCorrectPrice : boolean = (createFoodDto.price && createFoodDto.sizes == null) || (!createFoodDto.price && createFoodDto.sizes != null);
    if(!foodHasCorrectPrice) {
      return ResponseStatus.failed_response("you have to select price xor sizes" , "not error but bad input")
    }

   if(!image) {
    return ResponseStatus.failed_response('food image is required ' , null);
   }
   if(!MyFilesHelper.isOfTypePngOrJpeg(image.mimetype))
   return ResponseStatus.failed_response('food image must be of type {.png or .jpeg} ' , null);

    let newFood = await this.foodsService.create(createFoodDto , image);
    return ResponseStatus.success_response(newFood);
  }

  @Get('/:user_Id')
   async findAll(@Param('user_Id') user_Id : string) {
    let foods = await this.foodsService.findAll(+user_Id);
    return ResponseStatus.success_response(foods);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto , image : Express.Multer.File) {
    if(isNaN(+id)) {
      return ResponseStatus.failed_response('id must be a positive integer')
    }
    if(image && !MyFilesHelper.isOfTypePngOrJpeg(image.mimetype)) {
      return ResponseStatus.failed_response('image must be of type {.png  , .jpeg}')
    }
   let updatedFood = await this.foodsService.update(+id, updateFoodDto , image);
   return ResponseStatus.success_response(updatedFood);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if(isNaN(+id)) {
      return ResponseStatus.failed_response('id must be a positive integer')
    }
    await this.foodsService.remove(+id);
    return ResponseStatus.success_response('food removed with success .');
  }

  
@Get('/images/:imageUrl')
  async sendImage(@Param('imageUrl') imageUrl : string , @Res() _mResponse) {
  let file = await _mResponse.sendFile(join(process.cwd() , MyFilesHelper.FOOD_IMAGES_PATH+imageUrl));         
      return file;
}

  
}
