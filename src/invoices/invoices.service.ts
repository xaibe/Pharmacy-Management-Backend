import { Injectable } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { 
      customerId, 
      totalAmount, 
      discount = 0, 
      number, 
      date,
      paymentMethod = 'CASH',
      paidAmount = 0,
      dueAmount = 0,
    } = createInvoiceDto;
    
    // Auto-generate invoice number if not provided
    let invoiceNumber = number;
    if (!invoiceNumber) {
      invoiceNumber = await this.generateInvoiceNumber();
    }
    
    // Calculate payment amounts based on payment method
    let finalPaidAmount = paidAmount;
    let finalDueAmount = dueAmount;
    
    if (paymentMethod === 'CASH') {
      // For cash, paid amount equals total (after discount)
      finalPaidAmount = totalAmount - discount;
      finalDueAmount = 0;
    } else if (paymentMethod === 'CREDIT') {
      // For credit, nothing paid, all is due
      finalPaidAmount = 0;
      finalDueAmount = totalAmount - discount;
    } else if (paymentMethod === 'PARTIAL') {
      // For partial, use provided amounts or calculate
      if (paidAmount === 0 && dueAmount === 0) {
        // If not provided, assume all is due (credit)
        finalPaidAmount = 0;
        finalDueAmount = totalAmount - discount;
      } else {
        // Use provided amounts, but ensure they sum to total
        const netTotal = totalAmount - discount;
        if (paidAmount + dueAmount !== netTotal) {
          // Adjust due amount to match total
          finalDueAmount = netTotal - paidAmount;
        }
      }
    }
    
    // Determine status based on payment
    let status = 'pending';
    if (paymentMethod === 'CASH' && finalPaidAmount >= totalAmount - discount) {
      status = 'paid';
    } else if (paymentMethod === 'CREDIT') {
      status = 'credit';
    } else if (paymentMethod === 'PARTIAL') {
      status = finalDueAmount > 0 ? 'partial' : 'paid';
    }
    
    return this.prisma.invoice.create({
      data: {
        customerId,
        totalAmount,
        discount,
        number: invoiceNumber,
        date: new Date(date),
        paymentMethod,
        paidAmount: finalPaidAmount,
        dueAmount: finalDueAmount,
        status,
      },
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async findAll(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const updateData: any = {};
    
    if (updateInvoiceDto.totalAmount !== undefined) {
      updateData.totalAmount = updateInvoiceDto.totalAmount;
    }
    if (updateInvoiceDto.discount !== undefined) {
      updateData.discount = updateInvoiceDto.discount;
    }
    if (updateInvoiceDto.number !== undefined) {
      updateData.number = updateInvoiceDto.number;
    }
    if (updateInvoiceDto.date !== undefined) {
      updateData.date = new Date(updateInvoiceDto.date);
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async remove(id: number): Promise<Invoice> {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async getInvoicesByCustomer(customerId: number): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { customerId },
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async getInvoicesByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        Sales: true,
      },
    });
  }

  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        number: {
          startsWith: `INV-${year}-`,
        },
      },
      orderBy: { id: 'desc' },
    });
    
    let sequence = 1;
    if (lastInvoice) {
      // Extract sequence number from format INV-YYYY-XXXXXX
      const parts = lastInvoice.number.split('-');
      if (parts.length === 3 && parts[2]) {
        const lastSequence = parseInt(parts[2]);
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }
    }
    
    return `INV-${year}-${sequence.toString().padStart(6, '0')}`;
  }
} 