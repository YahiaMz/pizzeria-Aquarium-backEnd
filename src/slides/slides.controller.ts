import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { async } from 'rxjs';
import { join } from 'path';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
 async create(@UploadedFile() image : Express.Multer.File) {
    if(!image) {
      return ResponseStatus.failed_response("image is required to add new slide")
    } 
    if(!MyFilesHelper.isOfTypePngOrJpeg(image.mimetype)) {
      return ResponseStatus.failed_response("image must be of type png or jpg")
    }

    let newSlide = await this.slidesService.create(image);
    return ResponseStatus.success_response("slide added with success");
  }

  @Get()
 async findAll() {
    let slides = await this.slidesService.findAll();
    return ResponseStatus.success_response(slides);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor("image"))
  async update(@Param('id') id: string, @UploadedFile() updateSlideImage: Express.Multer.File ) {

    if(!updateSlideImage) {
      return ResponseStatus.failed_response("image is required to add new slide")
    } 

    

    if(!MyFilesHelper.isOfTypePngOrJpeg(updateSlideImage.mimetype)) {
      return ResponseStatus.failed_response("image must be of type png or jpg")
    }

    let isUpdated =  await this.slidesService.update(+id , updateSlideImage );
    if(isUpdated) {
     return ResponseStatus.success_response("updated with success !")
    } else {
     return ResponseStatus.failed_response("not updated , something wrong !")
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.slidesService.remove(+id);
     return ResponseStatus.success_response("slide removed with success !" );
  }

  @Get('/images/:imageUrl')
  async sendImage(@Param('imageUrl') imageUrl : string , @Res() _mResponse) {
  let file = await _mResponse.sendFile(join(process.cwd() , MyFilesHelper.SLIDES_IMAGES_PATH+imageUrl));         
      return file;
}



}
