import { Injectable } from '@nestjs/common';
import { Expense, ExpenseType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    expenseType: ExpenseType;
    amount: number;
    description: string;
    date: Date;
    paymentMethod?: string;
    receiptNumber?: string;
    notes?: string;
    userId?: number;
  }): Promise<Expense> {
    return this.prisma.expense.create({
      data: {
        ...data,
        amount: Math.abs(data.amount), // Ensure positive amount
      },
    });
  }

  async findAll(): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Expense | null> {
    return this.prisma.expense.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Expense>): Promise<Expense> {
    if (data.amount) {
      data.amount = Math.abs(data.amount); // Ensure positive amount
    }
    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Expense> {
    return this.prisma.expense.delete({
      where: { id },
    });
  }

  async getExpensesByCategory(expenseType: ExpenseType): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: { expenseType },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getTotalExpensesByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.expense.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  async getExpensesByCategoryAndDateRange(
    expenseType: ExpenseType,
    startDate: Date,
    endDate: Date,
  ): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: {
        expenseType,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getTotalExpensesByCategoryAndDateRange(
    expenseType: ExpenseType,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.expense.aggregate({
      where: {
        expenseType,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }
} 