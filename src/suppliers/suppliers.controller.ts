import
    {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        Patch,
        Post,
        UseGuards,
    } from '@nestjs/common';
import { Role, Supplier } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createSupplierDto: { name: string; phone: string; address: string }) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist)
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Pharmacist)
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: Partial<Supplier>,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }

  @Get(':id/inventory')
  @Roles(Role.Admin, Role.Pharmacist)
  getSupplierInventory(@Param('id') id: string) {
    return this.suppliersService.getSupplierInventory(+id);
  }

  @Get(':id/bills')
  @Roles(Role.Admin, Role.Pharmacist)
  getSupplierBills(@Param('id') id: string) {
    return this.suppliersService.getSupplierBills(+id);
  }
} 