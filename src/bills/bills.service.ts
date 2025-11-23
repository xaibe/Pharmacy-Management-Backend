import { Injectable } from '@nestjs/common';
import { Bill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    const { name, formula, type, supplierId, quantity, total } = createBillDto;
    
    return this.prisma.bill.create({
      data: {
        name,
        formula,
        type,
        supplierId,
        quantity,
        total,
      },
      include: {
        supplier: true,
      },
    });
  }

  async findAll(): Promise<Bill[]> {
    return this.prisma.bill.findMany({
      include: {
        supplier: true,
      },
    });
  }

  async findOne(id: number): Promise<Bill> {
    return this.prisma.bill.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });
  }

  async update(id: number, updateBillDto: UpdateBillDto): Promise<Bill> {
    const updateData: any = {};
    
    if (updateBillDto.name !== undefined) {
      updateData.name = updateBillDto.name;
    }
    if (updateBillDto.formula !== undefined) {
      updateData.formula = updateBillDto.formula;
    }
    if (updateBillDto.type !== undefined) {
      updateData.type = updateBillDto.type;
    }
    if (updateBillDto.supplierId !== undefined) {
      updateData.supplierId = updateBillDto.supplierId;
    }
    if (updateBillDto.quantity !== undefined) {
      updateData.quantity = updateBillDto.quantity;
    }
    if (updateBillDto.total !== undefined) {
      updateData.total = updateBillDto.total;
    }

    return this.prisma.bill.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
      },
    });
  }

  async remove(id: number): Promise<Bill> {
    return this.prisma.bill.delete({
      where: { id },
    });
  }

  async getBillsBySupplier(supplierId: number): Promise<Bill[]> {
    return this.prisma.bill.findMany({
      where: { supplierId },
      include: {
        supplier: true,
      },
    });
  }

  async getBillsByDateRange(startDate: Date, endDate: Date): Promise<Bill[]> {
    return this.prisma.bill.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        supplier: true,
      },
    });
  }
} 