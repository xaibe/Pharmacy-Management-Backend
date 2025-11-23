import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  const mockPrisma = {
    sale: { findMany: jest.fn() },
    inventory: { findMany: jest.fn() },
    expense: { findMany: jest.fn() },
    customer: { findMany: jest.fn() },
    // Add other mocks as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSalesReport', () => {
    it('should generate a sales report', async () => {
      const sales = [{ id: 1, total: 100 }, { id: 2, total: 200 }];
      mockPrisma.sale.findMany.mockResolvedValue(sales);
      const result = await service.generateSalesReport({ startDate: '2024-01-01', endDate: '2024-12-31' } as any);
      expect(result).toBeDefined();
      expect(mockPrisma.sale.findMany).toHaveBeenCalled();
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate an inventory report', async () => {
      const inventory = [{ id: 1, stock: 10 }, { id: 2, stock: 20 }];
      mockPrisma.inventory.findMany.mockResolvedValue(inventory);
      const result = await service.generateInventoryReport();
      expect(result).toBeDefined();
      expect(mockPrisma.inventory.findMany).toHaveBeenCalled();
    });
  });

  describe('generateFinancialReport', () => {
    it('should generate a financial report', async () => {
      const expenses = [{ id: 1, amount: 50 }, { id: 2, amount: 75 }];
      mockPrisma.expense.findMany.mockResolvedValue(expenses);
      const result = await service.generateFinancialReport({ startDate: '2024-01-01', endDate: '2024-12-31' } as any);
      expect(result).toBeDefined();
      expect(mockPrisma.expense.findMany).toHaveBeenCalled();
    });
  });

  describe('generateCustomerReport', () => {
    it('should generate a customer report', async () => {
      const customers = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      mockPrisma.customer.findMany.mockResolvedValue(customers);
      const result = await service.generateCustomerReport({ startDate: '2024-01-01', endDate: '2024-12-31' } as any);
      expect(result).toBeDefined();
      expect(mockPrisma.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('generateProductReport', () => {
    it('should generate a product report', async () => {
      const inventory = [{ id: 1, name: 'Med1' }, { id: 2, name: 'Med2' }];
      mockPrisma.inventory.findMany.mockResolvedValue(inventory);
      const result = await service.generateProductReport({ startDate: '2024-01-01', endDate: '2024-12-31' } as any);
      expect(result).toBeDefined();
      expect(mockPrisma.inventory.findMany).toHaveBeenCalled();
    });
  });
}); 