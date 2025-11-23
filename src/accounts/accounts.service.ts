import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // User account methods
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { emailAddress: email },
    });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(userData: any) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: number, userData: any) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  // Customer account methods for credit/loan management
  async getCustomerOutstandingBalance(customerId: number): Promise<number> {
    const unpaidInvoices = await this.prisma.invoice.findMany({
      where: {
        customerId,
        status: { in: ['pending', 'partial'] },
      },
      select: {
        totalAmount: true,
        discount: true,
      },
    });

    return unpaidInvoices.reduce((total, invoice) => {
      return total + (invoice.totalAmount - invoice.discount);
    }, 0);
  }

  async getCustomerAccountSummary(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        Invoice: {
          orderBy: { date: 'desc' },
        },
        Sales: {
          include: {
            inventory: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      return null;
    }

    const totalInvoices = customer.Invoice.length;
    const paidInvoices = customer.Invoice.filter(
      (inv) => inv.status === 'paid' || inv.status === 'completed',
    ).length;
    const pendingInvoices = customer.Invoice.filter(
      (inv) => inv.status === 'pending',
    ).length;
    const outstandingBalance = await this.getCustomerOutstandingBalance(customerId);
    const totalPurchases = customer.Invoice.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0,
    );

    return {
      customer,
      accountSummary: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        outstandingBalance,
        totalPurchases,
      },
    };
  }

  async getCustomerPaymentHistory(customerId: number) {
    return this.prisma.invoice.findMany({
      where: {
        customerId,
        status: { in: ['paid', 'completed', 'partial'] },
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        number: true,
        date: true,
        totalAmount: true,
        discount: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async getCustomerPendingInvoices(customerId: number) {
    return this.prisma.invoice.findMany({
      where: {
        customerId,
        status: 'pending',
      },
      orderBy: { date: 'asc' },
      include: {
        Sales: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }
} 