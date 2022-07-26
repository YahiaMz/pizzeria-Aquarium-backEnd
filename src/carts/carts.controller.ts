import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { CartsService } from './carts.service';
import { AddFoodToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(@Body() addFoodToCart: AddFoodToCartDto) {
    let newItem = await this.cartsService.addToCart(addFoodToCart);
    return ResponseStatus.success_response(newItem);
  }

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

  @Patch('/:cartItemId/changeSizeTo/:size_Id')
  async changeCartSize(
    @Param('cartItemId') cartItemId: string,
    @Param('size_Id') size_Id: string,
  ) {
    if (isNaN(+cartItemId)) {
      return ResponseStatus.failed_response(
        'cartItemId must be an positive integer',
      );
    }

    if (isNaN(+size_Id) && +size_Id == 0 ) {
      return ResponseStatus.failed_response(
        'size_Id must be an positive integer and not equals 0',
      );
    }

    let updatedCartItem = await this.cartsService.changeCartItemSize(
      +cartItemId,
      +size_Id,
    );
    return ResponseStatus.success_response(updatedCartItem);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartsService.remove(+id);
    return ResponseStatus.success_response('item removed with success !');
  }
}
