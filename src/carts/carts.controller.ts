import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { CartsService } from './carts.service';
import { AddFoodToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(@Body() addFoodToCart : AddFoodToCartDto) {
    let newItem = await this.cartsService.addToCart(addFoodToCart);
    return ResponseStatus.success_response(newItem);
  }


  @Get('/:user_Id')
  async findAll(@Param('user_Id') user_Id : string) {
    if(isNaN(+user_Id)) {
      return ResponseStatus.failed_response('user_Id must be an positive integer')
    }
    let cartItems = await this.cartsService.findAllCartItemsOfUser( +user_Id );
    return ResponseStatus.success_response(cartItems);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartsService.remove(+id);
    return ResponseStatus.success_response('item removed with success !')
  }
}
