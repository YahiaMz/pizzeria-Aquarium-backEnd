import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WriteStream } from 'fs';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    let newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
    });
    let newImageName = await MyFilesHelper.saveCategoryImage(file);
    if (! newImageName) {
      MyExceptions.throwException(
        'something error while saving the image',
        'image_ERROR',
      );
    }
    newCategory.imageUrl = newImageName;

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if(error.error != "image_ERROR") {
         MyFilesHelper.RemoveCategoryImage(newCategory.imageUrl)
      }

      MyExceptions.throwException('DUPLICATE_NAME', error.message);
    }

    return 'This action adds a new category';
  }

  async findAll() {
    try {
      let categories = await this.categoryRepository.find();
      return categories;
    } catch (error) {
      MyExceptions.throwException('something wrong', error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto , image : Express.Multer.File) {
     let categoryToUpdate = await this.findCategoryByIdOrThrowException(id);
      categoryToUpdate.name = updateCategoryDto.name; 
     
     if(image) MyFilesHelper.updateCategoryImage(image, categoryToUpdate.imageUrl);
      try {
       await this.categoryRepository.save(categoryToUpdate);
       return ;
      } catch (error) {
        
        MyExceptions.throwException("DUPLICATE_NAME" , error.message);
      }
    
  }

  async remove(id: number) {
    let categoryToRemove = await this.findCategoryByIdOrThrowException(id);
    try {
    console.log(
     await MyFilesHelper.RemoveCategoryImage(categoryToRemove.imageUrl)
    )
    this.categoryRepository.remove(categoryToRemove);
      return;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while removing this category !',
        error.message,
      );
    }
  }

  async findCategoryByIdOrThrowException(id: number) {
    try {
      let category = await this.categoryRepository.findOneBy({ id: id });
      if (category != null) {
        return category;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong', error.message);
    }

    MyExceptions.throwException('category not found' , null);
  }
}
