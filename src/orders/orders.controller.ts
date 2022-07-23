import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MakeOrderDto } from './dto/make-order.dto';
import { ChangeTheOrderStatusDto, } from './dto/change-order-status.dto';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { userInfo } from 'os';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: MakeOrderDto) {
    let newOrder = await this.ordersService.MakeOrder(createOrderDto);
    return newOrder
      ? ResponseStatus.success_response(
          'congratulation , order placed with success',
        )
      : ResponseStatus.failed_response(
          'something wrong , please re-make your order !',
        );
  }

  @Get()
  async findAllOrders() {
    let orders = await this.ordersService.findAll();
    return ResponseStatus.success_response(orders);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let orders = await this.ordersService.findAllOrdersOfUser(+id);
    return ResponseStatus.success_response(orders);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() changeOrderStatusDto: ChangeTheOrderStatusDto) {
    return this.ordersService.changeOrderStatus(+id, changeOrderStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
