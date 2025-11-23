import { BadRequestException, Injectable } from '@nestjs/common';
import { Sale } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { 
      name, 
      formula, 
      type, 
      quantity, 
      price, 
      discount = 0, 
      replace, 
      userId, 
      customerId, 
      invoiceId,
      inventoryId,
      stockBatchId 
    } = createSaleDto;

    // Validate inventory exists and has sufficient stock
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { stockBatches: true },
    });

    if (!inventory) {
      throw new BadRequestException(`Inventory with ID ${inventoryId} not found`);
    }

    // If stockBatchId is provided, validate and use it
    // Otherwise, use FIFO (First In, First Out) - oldest batch first
    let batchToUse = stockBatchId;
    
    if (!batchToUse) {
      // Find oldest batch with sufficient quantity (FIFO)
      const availableBatches = inventory.stockBatches
        .filter(batch => batch.quantity >= quantity)
        .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
      
      if (availableBatches.length === 0) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${inventory.stock}, Requested: ${quantity}`
        );
      }
      
      batchToUse = availableBatches[0].id;
    } else {
      // Validate the provided batch
      const batch = await this.prisma.stockBatch.findUnique({
        where: { id: batchToUse },
      });
      
      if (!batch || batch.inventoryId !== inventoryId) {
        throw new BadRequestException(`Stock batch with ID ${batchToUse} not found or doesn't match inventory`);
      }
      
      if (batch.quantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock in batch. Available: ${batch.quantity}, Requested: ${quantity}`
        );
      }
    }

    const totalAmount = (price * quantity) - discount;

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // Create the sale
      const sale = await tx.sale.create({
        data: {
          name,
          formula,
          type,
          quantity,
          price,
          totalAmount,
          discount,
          replace,
          userId,
          customerId,
          invoiceId,
          inventoryId,
          stockBatchId: batchToUse,
        },
        include: {
          user: true,
          customer: true,
          invoice: true,
          inventory: true,
          stockBatch: true,
        },
      });

      // Update stock batch quantity
      await tx.stockBatch.update({
        where: { id: batchToUse },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Update inventory total stock
      await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      return sale;
    });
  }

  async findAll(): Promise<Sale[]> {
    try {
      return await this.prisma.sale.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              emailAddress: true,
              roles: true,
            },
          },
          customer: true,
          invoice: true,
          inventory: {
            select: {
              id: true,
              name: true,
              retailPrice: true,
              wholeSalePrice: true,
            },
          },
          stockBatch: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Sale> {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        user: true,
        customer: true,
        invoice: true,
        inventory: true,
        stockBatch: true,
      },
    });
  }

  async update(id: number, data: Partial<Sale>): Promise<Sale> {
    return this.prisma.sale.update({
      where: { id },
      data,
      include: {
        user: true,
        customer: true,
        invoice: true,
      },
    });
  }

  async remove(id: number): Promise<Sale> {
    return this.prisma.sale.delete({
      where: { id },
    });
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        customer: true,
        invoice: true,
        inventory: true,
        stockBatch: true,
      },
    });
  }

  async getSalesByCustomer(customerId: number): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { customerId },
      include: {
        user: true,
        customer: true,
        invoice: true,
        inventory: true,
        stockBatch: true,
      },
    });
  }

  async getSalesByUser(userId: number): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        customer: true,
        invoice: true,
      },
    });
  }
} 