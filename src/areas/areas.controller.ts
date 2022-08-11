import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    let newArea = await this.areasService.create(createAreaDto);
    return ResponseStatus.success_response("created with success ");
  }

  @Get()
 async findAll() {
    let allAreas = await this.areasService.findAll();
    return ResponseStatus.success_response(allAreas);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {

    if(isNaN(+id)) return ResponseStatus.failed_response('id must be an positive integer')

   let area = await this.areasService.update(+id, updateAreaDto);
    return ResponseStatus.success_response("area updated with success");
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.areasService.remove(+id);
    return ResponseStatus.success_response('Area removed with success !')
  }
}
