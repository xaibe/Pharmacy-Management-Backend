import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreatePurchaseOrderDto) {
    return this.prismaService.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        orderDate: data.orderDate,
        status: data.status,
        totalAmount: data.totalAmount,
      },
      include: {
        supplier: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.purchaseOrder.findMany({
      include: {
        supplier: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prismaService.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, data: UpdatePurchaseOrderDto) {
    await this.findOne(id);
    return this.prismaService.purchaseOrder.update({
      where: { id },
      data: {
        supplierId: data.supplierId,
        orderDate: data.orderDate,
        status: data.status,
        totalAmount: data.totalAmount,
      },
      include: {
        supplier: true,
      },
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    await this.findOne(id);
    return this.prismaService.purchaseOrder.update({
      where: { id },
      data: { status },
      include: {
        supplier: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.purchaseOrder.delete({
      where: { id },
      include: {
        supplier: true,
      },
    });
  }

  async findBySupplier(supplierId: number) {
    return this.prismaService.purchaseOrder.findMany({
      where: { supplierId },
      include: {
        supplier: true,
      },
    });
  }

  async findByStatus(status: OrderStatus) {
    return this.prismaService.purchaseOrder.findMany({
      where: { status },
      include: {
        supplier: true,
      },
    });
  }
}  