import { Module } from '@nestjs/common';
import { ExpensesModule } from '../expenses/expenses.module';
import { InventoryModule } from '../inventory/inventory.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { PrismaService } from '../prisma/prisma.service';
import { ReturnsModule } from '../returns/returns.module';
import { SalesModule } from '../sales/sales.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    SalesModule,
    InventoryModule,
    ExpensesModule,
    InvoicesModule,
    ReturnsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
  exports: [ReportsService],
})
export class ReportsModule {} 