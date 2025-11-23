import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Role, Sale } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(Role.Admin, Role.Cashier)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Cashier)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Cashier)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: Partial<Sale>,
  ) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }

  @Get('date-range')
  @Roles(Role.Admin, Role.Cashier)
  getSalesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.salesService.getSalesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('customer/:customerId')
  @Roles(Role.Admin, Role.Cashier)
  getSalesByCustomer(@Param('customerId') customerId: string) {
    return this.salesService.getSalesByCustomer(+customerId);
  }

  @Get('user/:userId')
  @Roles(Role.Admin)
  getSalesByUser(@Param('userId') userId: string) {
    return this.salesService.getSalesByUser(+userId);
  }
} 