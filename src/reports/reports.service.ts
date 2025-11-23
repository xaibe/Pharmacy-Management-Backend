import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateSalesReport(startDate: Date, endDate: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        inventory: true,
      },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    const salesByType = await this.prisma.sale.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      period: { startDate, endDate },
      totalSales,
      totalItems,
      salesByType,
      sales,
    };
  }

  async generateInventoryReport() {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });

    // Using stock field instead of quantity, and no minStock field exists
    const lowStock = inventory.filter(item => item.stock <= 10); // Using 10 as default low stock threshold
    const outOfStock = inventory.filter(item => item.stock === 0);
    const expiringSoon = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    // Group by product type (Medicine, Food, Cosmetic, Other)
    const inventoryByType = await (this.prisma.inventory.groupBy as any)({
      by: ['type'],
      _sum: {
        stock: true,
        value: true,
      },
    });

    // Group by category for category distribution chart
    const inventoryByCategory = await (this.prisma.inventory.groupBy as any)({
      by: ['categoryId'],
      _sum: {
        stock: true,
        value: true,
      },
    });

    // Map category IDs to category names
    const categoryMap = new Map<number, string>();
    inventory.forEach(item => {
      if (item.category) {
        categoryMap.set(item.categoryId, item.category.name);
      }
    });

    const inventoryByCategoryWithNames = inventoryByCategory.map((item: any) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) || 'Unknown',
      stock: item._sum?.stock || 0,
      value: item._sum?.value || 0,
    }));

    return {
      totalItems: inventory.length,
      lowStock,
      outOfStock,
      expiringSoon,
      inventoryByType,
      inventoryByCategory: inventoryByCategoryWithNames,
      inventory,
    };
  }

  async generateFinancialReport(startDate: Date, endDate: Date) {
    const sales = await this.prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const expenses = await this.prisma.expense.aggregate({
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

    const returns = await this.prisma.return.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalRefundAmount: true,
      },
    });

    const netIncome = (sales._sum.totalAmount || 0) - 
                     (expenses._sum.amount || 0) - 
                     (returns._sum.totalRefundAmount || 0);

    return {
      period: { startDate, endDate },
      totalSales: sales._sum.totalAmount || 0,
      totalExpenses: expenses._sum.amount || 0,
      totalReturns: returns._sum.totalRefundAmount || 0,
      netIncome,
    };
  }

  async generateReturnsReport(startDate: Date, endDate: Date) {
    const returns = await this.prisma.return.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        sale: {
          include: {
            inventory: true,
            customer: true,
          },
        },
        returnedItems: {
          include: {
            inventory: true,
          },
        },
      },
    });

    const totalRefundAmount = returns.reduce(
      (sum, returnItem) => sum + returnItem.totalRefundAmount,
      0,
    );

    const returnsByStatus = await this.prisma.return.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalRefundAmount: true,
      },
    });

    return {
      period: { startDate, endDate },
      totalReturns: returns.length,
      totalRefundAmount,
      returnsByStatus: returnsByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
        totalRefund: item._sum.totalRefundAmount || 0,
      })),
      returns,
    };
  }

  async generateCustomerReport(startDate: Date, endDate: Date) {
    const customers = await this.prisma.customer.findMany({
      include: {
        Sales: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        Invoice: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const customerStats = customers.map(customer => {
      const totalPurchases = customer.Sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalItems = customer.Sales.reduce((sum, sale) => sum + sale.quantity, 0);

      return {
        customerId: customer.id,
        customerName: customer.name,
        customerType: customer.customerType,
        totalPurchases,
        totalItems,
        purchaseCount: customer.Sales.length,
        invoiceCount: customer.Invoice.length,
      };
    });

    return {
      period: { startDate, endDate },
      totalCustomers: customers.length,
      customerStats,
    };
  }

  async generateProductReport(startDate: Date, endDate: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        inventory: true,
      },
    });

    const productStats = new Map();

    sales.forEach(sale => {
      const productId = sale.inventoryId;
      if (!productStats.has(productId)) {
        productStats.set(productId, {
          productId,
          productName: sale.inventory.name,
          totalQuantity: 0,
          totalRevenue: 0,
          saleCount: 0,
        });
      }

      const stats = productStats.get(productId);
      stats.totalQuantity += sale.quantity;
      stats.totalRevenue += sale.price * sale.quantity;
      stats.saleCount += 1;
    });

    return {
      period: { startDate, endDate },
      totalProducts: productStats.size,
      productStats: Array.from(productStats.values()),
    };
  }
} 