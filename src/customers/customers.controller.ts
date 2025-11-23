import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @Get('type/:type')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  getCustomersByType(@Param('type') type: string) {
    return this.customersService.getCustomersByType(type as any);
  }

  @Get('search/query')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  searchCustomers(@Query('q') query: string) {
    return this.customersService.searchCustomers(query);
  }

  @Get('analytics/summary')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  getCustomerAnalytics() {
    return this.customersService.getCustomerAnalytics();
  }

  @Get('analytics/top-customers')
  @Roles(Role.Admin)
  getTopCustomers(@Query('limit') limit: string = '10') {
    return this.customersService.getTopCustomers(+limit);
  }
} 