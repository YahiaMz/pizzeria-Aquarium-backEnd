import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
  ) {}
  async create(createAreaDto: CreateAreaDto) {
    try {
      let newArea = this.areaRepository.create({ area: createAreaDto.area });
       await this.areaRepository.save(newArea);
      return;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while creating area',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      return await this.areaRepository.find();
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while fetching areas',
        error.message,
      );
    }
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    let areaToUpdate = await this.findAreaByIdOrThrowException(id);

    try {
      areaToUpdate.area = updateAreaDto.area;
     await this.areaRepository.save(areaToUpdate);
     return ;
    } catch (error) {
      MyExceptions.throwException("area name exist !" , null)
    }

  }

  async remove(id: number) {
    let areaToRemove = await this.findAreaByIdOrThrowException(id);

    try {
      await this.areaRepository.remove(areaToRemove);
      return;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while removing this area',
        error.message,
      );
    }
  }

  async findAreaByIdOrThrowException(id: number) {
    try {
      let area = this.areaRepository.findOne({
        where: {
          id: id,
        },
      });
      if (area) return area;
    } catch (error) {
      MyExceptions.throwException(
        'something wrong while fetching this Item',
        error.message,
      );
    }

    MyExceptions.throwException('this area not found !', null);
  }
}
