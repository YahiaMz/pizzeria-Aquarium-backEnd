import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { Repository } from 'typeorm';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './entities/slide.entity';

@Injectable()
export class SlidesService {
  constructor (@InjectRepository(Slide) private slideRepository : Repository<Slide>) {
    
  }
  async create(image : Express.Multer.File) {
    try {
      let newSlideImageName = MyFilesHelper.saveSlideImage(image);
      if(newSlideImageName) {
        let newSlideRow = this.slideRepository.create({imageUrl : newSlideImageName })
          return await this.slideRepository.save(newSlideRow)
        }

    } catch (error) {
      MyExceptions.throwException("something wrong while creating new slide" , error.error);
    }

  }

  async findAll() {
    try {
      let slides = await this.slideRepository.find( );
      return slides;
    } catch (error) {
      MyExceptions.throwException("something wrong while fetching slides" , error.error);
    }
  }

  async update(id: number, image : Express.Multer.File) : Promise<Boolean> {
let slideRow = await this.findSlideRowByIdOrThrowException(id);

    try {
      let updatedSlideImageName = MyFilesHelper.updateSlideImage(image , slideRow.imageUrl);
      if(updatedSlideImageName) {
          return true;
        }

    } catch (error) {
      MyExceptions.throwException("something wrong while creating new slide" , error.error);
    }

    return false;
  }


  async findSlideRowByIdOrThrowException( id : number ) {
    try {
      let slideRow = await this.slideRepository.findOne({where : {id : id}})
      if(slideRow ) return slideRow;
    } catch (error) {
      MyExceptions.throwException("something wrong while fetching this slide" , error.error);
    }
    MyExceptions.throwException("this slide not found !" , null);
  }


  async remove(id: number) {
 
    let slideToRemove = await this.findSlideRowByIdOrThrowException(id);
    
    try {
      
     let removeImageR = MyFilesHelper.removeSlideImage(slideToRemove.imageUrl);
     if(!removeImageR) {
      console.log("file could not removed !!");
      
     }
      await this.slideRepository.remove(slideToRemove);

      return;
    } catch (error) {
     MyExceptions.throwException("something wrong while removing this slide",error.message) 
    }

  

  }
}
