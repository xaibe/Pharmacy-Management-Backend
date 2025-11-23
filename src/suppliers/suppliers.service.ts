import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSupplierDto) {
    return this.prismaService.supplier.create({
      data: {
        supplierName: data.name,
        companyName: data.name,
        number: data.phone,
        address: data.address,
      },
      include: {
        Inventory: true,
        Bill: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.supplier.findMany({
      include: {
        Inventory: true,
        Bill: true,
      },
    });
  }

  async findOne(id: number) {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
      include: {
        Inventory: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: number, data: UpdateSupplierDto) {
    await this.findOne(id);

    return this.prismaService.supplier.update({
      where: { id },
      data: {
        supplierName: data.name,
        companyName: data.name,
        number: data.phone,
        address: data.address,
      },
      include: {
        Inventory: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.supplier.delete({
      where: { id },
      include: {
        Bill: true,
      },
    });
  }

  async getSupplierInventory(id: number) {
    return this.prismaService.supplier.findUnique({
      where: { id },
      include: {
        Inventory: true,
      },
    });
  }

  async getSupplierBills(id: number) {
    return this.prismaService.supplier.findUnique({
      where: { id },
      include: {
        Bill: true,
      },
    });
  }
} 