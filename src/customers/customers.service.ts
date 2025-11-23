import { Injectable } from '@nestjs/common';
import { Customer, CustomerType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const data = {
      name: createCustomerDto.name,
      customerType: createCustomerDto.customerType,
      phoneNumber: createCustomerDto.phoneNumber,
      email: createCustomerDto.email,
      address: createCustomerDto.address,
      defaultDiscount: createCustomerDto.defaultDiscount,
    };

    return this.prisma.customer.create({
      data,
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async findOne(id: number): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async remove(id: number): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getCustomersByType(customerType: CustomerType): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: { customerType },
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async getCustomerWithSales(id: number): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        Sales: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async getCustomerWithInvoices(id: number): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        Invoice: true,
      },
    });
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        Sales: true,
        Invoice: true,
      },
    });
  }

  async getCustomerAnalytics() {
    const totalCustomers = await this.prisma.customer.count();
    const customersByType = await this.prisma.customer.groupBy({
      by: ['customerType'],
      _count: {
        id: true,
      },
    });

    const customersWithSales = await this.prisma.customer.findMany({
      include: {
        Sales: true,
      },
    });

    const totalRevenue = customersWithSales.reduce(
      (sum, customer) =>
        sum + customer.Sales.reduce((saleSum, sale) => saleSum + sale.totalAmount, 0),
      0,
    );

    return {
      totalCustomers,
      customersByType: customersByType.map((item) => ({
        type: item.customerType,
        count: item._count.id,
      })),
      totalRevenue,
    };
  }

  async getTopCustomers(limit: number = 10) {
    const customers = await this.prisma.customer.findMany({
      include: {
        Sales: true,
      },
    });

    const customersWithStats = customers.map((customer) => {
      const totalPurchases = customer.Sales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0,
      );
      return {
        ...customer,
        totalPurchases,
        purchaseCount: customer.Sales.length,
      };
    });

    return customersWithStats
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, limit);
  }
} 