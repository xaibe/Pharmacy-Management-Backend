import
    {
        Body,
        Controller,
        Get,
        Param,
        Patch,
        Post,
        Query,
        UseGuards,
    } from '@nestjs/common';
import { ReturnStatus, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnsService } from './returns.service';

@Controller('returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @Roles(Role.Admin, Role.Cashier)
  create(@Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.create(createReturnDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Cashier)
  findAll() {
    return this.returnsService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Cashier)
  findOne(@Param('id') id: string) {
    return this.returnsService.findOne(+id);
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReturnStatus,
  ) {
    return this.returnsService.updateStatus(+id, status);
  }

  @Get('invoice/:invoiceId')
  @Roles(Role.Admin, Role.Cashier)
  getReturnsByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.returnsService.getReturnsByInvoice(+invoiceId);
  }

  @Get('date-range')
  @Roles(Role.Admin, Role.Cashier)
  getReturnsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.returnsService.getReturnsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('status/:status')
  @Roles(Role.Admin, Role.Cashier)
  getReturnsByStatus(@Param('status') status: ReturnStatus) {
    return this.returnsService.getReturnsByStatus(status);
  }

  @Get('generate-number')
  @Roles(Role.Admin, Role.Cashier)
  generateReturnNumber() {
    return this.returnsService.generateReturnNumber();
  }
} 