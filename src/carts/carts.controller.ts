import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { CartsService } from './carts.service';
import { AddFoodToCartDto } from './dto/add-to-cart.dto';
import { ChangeFoodInCartSizeDto } from './dto/change-cart-food-size.dto';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() addFoodToCart: AddFoodToCartDto) {
    let newItem = await this.cartsService.addToCart(addFoodToCart);
    return ResponseStatus.success_response(newItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:user_Id')
  async findAll(@Param('user_Id') user_Id: string) {
    if (isNaN(+user_Id)) {
      return ResponseStatus.failed_response(
        'user_Id must be an positive integer',
      );
    }
    let cartItems = await this.cartsService.findAllCartItemsOfUser(+user_Id);
    return ResponseStatus.success_response(cartItems);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:cartItemId/add/:newQuantity')
  async updateQuantity(
    @Param('cartItemId') cartItemId: string,
    @Param('newQuantity') newQuantity: string,
  ) {
    if (isNaN(+cartItemId)) {
      return ResponseStatus.failed_response(
        'cartItemId must be an positive integer',
      );
    }

    if (isNaN(+newQuantity) && +newQuantity == 0 ) {
      return ResponseStatus.failed_response(
        'quantity must be an positive integer and not equals 0',
      );
    }

    let updatedCartItem = await this.cartsService.addThisQuantityToCartItem(
      +cartItemId,
      +newQuantity,
    );
    return ResponseStatus.success_response(updatedCartItem);
  }

  @Patch('/:user_Id')
  async changeCartSize(
    @Param('user_Id') user_Id: string,
    @Body() changeFoodInCartSizeDto : ChangeFoodInCartSizeDto
  ) {
    if (isNaN(+user_Id)) {
      return ResponseStatus.failed_response(
        'user_Id must be an positive integer',
      );
    }

    let updatedCartItem = await this.cartsService.changeCartItemSize(
      +user_Id ,
      +changeFoodInCartSizeDto.cartItem_Id,
      +changeFoodInCartSizeDto.size_Id,
    );
    console.log(updatedCartItem);
    
    return ResponseStatus.success_response(updatedCartItem);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartsService.remove(+id);
    return ResponseStatus.success_response('item removed with success !');
  }
}
