import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(@Body() createCategoryDto: CreateCategoryDto , @UploadedFile() image : Express.Multer.File) {
    if(!image) {
      return ResponseStatus.failed_response("IMAGE_IS_REQUIRED");
    }
   console.log(image)

   if(!MyFilesHelper.isOfTypePng(image.mimetype)) {
      return ResponseStatus.failed_response("IMAGE_MUST_OF_TYPE_PNG");
    }

    let newCategory = await this.categoriesService.create(createCategoryDto , image);
    return ResponseStatus.success_response("CREATED");
  }

  @Get()
  async findAll() {
    let categories = await this.categoriesService.findAll();
     return ResponseStatus.success_response(categories)
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto , @UploadedFile() image : Express.Multer.File) {
    
    if(image && !MyFilesHelper.isOfTypePng(image.mimetype)) {
      return ResponseStatus.failed_response('IMAGE_MUST_OF_TYPE_PNG' , null);
    }

    if(isNaN(+id)) {
      return ResponseStatus.failed_response('enter a valid id' , "id must be a positive integer");
    }
    let updatedCategory = await this.categoriesService.update(+id, updateCategoryDto , image);
    return ResponseStatus.success_response("Category updated with success");
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if(isNaN(+id)) {
      return ResponseStatus.failed_response('enter a valid id' , "id must be a positive integer");
    }
    await this.categoriesService.remove(+id);
    return ResponseStatus.success_response('category removed with success')

  }

  @Get('/images/:imageUrl')
  async sendImage(@Param('imageUrl') imageUrl : string , @Res() _mResponse) {
  let file = await _mResponse.sendFile(join(process.cwd() , MyFilesHelper.CATEGORY_IMAGES_PATH+imageUrl));         
      return file;
}
}
