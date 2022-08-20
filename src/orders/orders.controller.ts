import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MakeOrderDto } from './dto/make-order.dto';
import { ChangeTheOrderStatusDto, } from './dto/change-order-status.dto';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { userInfo } from 'os';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
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

  @Get("")
  async findAllOrders() {
    let orders = await this.ordersService.findAll();
    return ResponseStatus.success_response(orders);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:order_Id/received")
  async orderReceived(@Param("order_Id") orderId : string) {
     await this.ordersService.OrderReceived(+orderId);
    return ResponseStatus.success_response("RECEIVED");
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let orders = await this.ordersService.findAllOrdersOfUser(+id);
    return ResponseStatus.success_response(orders);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() changeOrderStatusDto: ChangeTheOrderStatusDto) {
    await this.ordersService.changeOrderStatus(+id, changeOrderStatusDto);
    return ResponseStatus.success_response(
          'order status changed',
        );
  }


}
