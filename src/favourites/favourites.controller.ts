import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { ResponseStatus } from 'src/Utils/ResponseStatus';

@Controller('favourites')

export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post()
  async Like(@Body() createFavouriteDto: CreateFavouriteDto) {
    let likedOrDisliked = await this.favouritesService.Like(createFavouriteDto);
   return ResponseStatus.success_response(likedOrDisliked);
  }

  @Get('/:user_Id')
  async findAll(@Param('user_Id') userId) {
    let favorites = await this.favouritesService.findAllFavoritesOfUser(userId);
    return ResponseStatus.success_response(favorites);

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favouritesService.remove(+id);
  }
}
