import { Injectable } from '@nestjs/common';
import { Return } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(createReturnDto: CreateReturnDto): Promise<Return> {
    const { saleId, reason, invoiceId } = createReturnDto;
    
    return this.prisma.return.create({
      data: {
        saleId,
        reason,
        invoiceId,
        status: 'pending',
        totalRefundAmount: 0,
      },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Return[]> {
    return this.prisma.return.findMany({
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Return> {
    return this.prisma.return.findUnique({
      where: { id },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async update(id: number, updateReturnDto: UpdateReturnDto): Promise<Return> {
    const updateData: any = {};
    
    if (updateReturnDto.reason !== undefined) {
      updateData.reason = updateReturnDto.reason;
    }
    if (updateReturnDto.status !== undefined) {
      updateData.status = updateReturnDto.status;
    }
    if (updateReturnDto.totalRefundAmount !== undefined) {
      updateData.totalRefundAmount = updateReturnDto.totalRefundAmount;
    }

    return this.prisma.return.update({
      where: { id },
      data: updateData,
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async remove(id: number): Promise<Return> {
    return this.prisma.return.delete({
      where: { id },
    });
  }

  async getReturnsByInvoice(invoiceId: number): Promise<Return[]> {
    return this.prisma.return.findMany({
      where: { invoiceId },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async getReturnsByStatus(status: string): Promise<Return[]> {
    return this.prisma.return.findMany({
      where: { status },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async getReturnsByDateRange(startDate: Date, endDate: Date): Promise<Return[]> {
    return this.prisma.return.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: string): Promise<Return> {
    return this.prisma.return.update({
      where: { id },
      data: { status },
      include: {
        sale: true,
        invoice: true,
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async generateReturnNumber(): Promise<{ returnNumber: string }> {
    const year = new Date().getFullYear();
    const count = await this.prisma.return.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });
    const returnNumber = `RET-${year}-${String(count + 1).padStart(6, '0')}`;
    return { returnNumber };
  }
} 