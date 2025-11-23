import
    {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        Patch,
        Post,
        UseGuards
    } from '@nestjs/common';
import { OrderStatus, PurchaseOrder, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PurchaseOrdersService } from './purchase-orders.service';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  @Roles(Role.Admin, Role.Pharmacist)
  create(@Body() createPurchaseOrderDto: { supplierId: number; orderDate: Date; status: OrderStatus; totalAmount: number }) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist)
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Pharmacist)
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: Partial<PurchaseOrder>,
  ) {
    return this.purchaseOrdersService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(+id);
  }

  @Patch(':id/status')
  @Roles(Role.Admin, Role.Pharmacist)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.purchaseOrdersService.updateStatus(+id, status);
  }

  @Get('supplier/:supplierId')
  @Roles(Role.Admin, Role.Pharmacist)
  getOrdersBySupplier(@Param('supplierId') supplierId: string) {
    return this.purchaseOrdersService.findBySupplier(+supplierId);
  }

  @Get('status/:status')
  @Roles(Role.Admin, Role.Pharmacist)
  getOrdersByStatus(@Param('status') status: OrderStatus) {
    return this.purchaseOrdersService.findByStatus(status);
  }
} 