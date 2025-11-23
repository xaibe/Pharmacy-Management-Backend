import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { PrismaService } from '../prisma/prisma.service';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';

@Module({
  imports: [InventoryModule, InvoicesModule],
  controllers: [ReturnsController],
  providers: [ReturnsService, PrismaService],
  exports: [ReturnsService],
})
export class ReturnsModule {} 