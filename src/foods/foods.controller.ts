import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Logger } from '@nestjs/common';
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

    let isThereAllThreePrices : boolean  = createFoodDto.small_Size_price != null && createFoodDto.medium_Size_price != null && createFoodDto.large_Size_price !=null; 
    let isThereNoSizePrice : boolean = createFoodDto.small_Size_price == null && createFoodDto.medium_Size_price == null && createFoodDto.large_Size_price ==null; 

    

    let foodHasCorrectPrice : boolean = (createFoodDto.price !=null && isThereNoSizePrice) || (createFoodDto.price == null && isThereAllThreePrices );
    if(!foodHasCorrectPrice) {
      return ResponseStatus.failed_response("you have to select price xor all sizes prices" , "not error but bad input")
    }

   if(!image) {
    return ResponseStatus.failed_response('food image is required ' , null);
   }
   if(!MyFilesHelper.isOfTypePngOrJpeg(image.mimetype))
   return ResponseStatus.failed_response('food image must be of type {.png or .jpeg} ' , null);

    let newFood = await this.foodsService.create(createFoodDto , image);
    return ResponseStatus.success_response("food created with success");
  }

  @Get('/:user_Id')
   async findAll(@Param('user_Id') user_Id : string) {
    let foods = await this.foodsService.findAll(+user_Id);
    return ResponseStatus.success_response(foods);
  }

  @Get('/')
  async findAllForAdmin() {
   let foods = await this.foodsService.findAllFoodsForAdmin();
   return ResponseStatus.success_response(foods);
 }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto ,@UploadedFile() image : Express.Multer.File) {
    if(isNaN(+id)) {
      return ResponseStatus.failed_response('id must be a positive integer')
    }

    if(image && !MyFilesHelper.isOfTypePngOrJpeg(image.mimetype)) {
      return ResponseStatus.failed_response('image must be of type {.png  , .jpeg}')
    }

    let isThereAllThreePrices : boolean  = updateFoodDto.small_Size_price != null && updateFoodDto.medium_Size_price != null && updateFoodDto.large_Size_price !=null; 
    let isThereNoSizePrice : boolean = updateFoodDto.small_Size_price == null && updateFoodDto.medium_Size_price == null && updateFoodDto.large_Size_price ==null; 
    let foodHasCorrectPrice : boolean = (updateFoodDto.price !=null && isThereNoSizePrice) || (updateFoodDto.price == null && isThereAllThreePrices== true) || (isThereAllThreePrices == false && updateFoodDto.price==null) ;


    if(!foodHasCorrectPrice) {
      return ResponseStatus.failed_response("you have to select price xor all sizes prices" , "not error but bad input")
    }


 await this.foodsService.update(+id, updateFoodDto , image);
   return ResponseStatus.success_response("UPDATED");
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
