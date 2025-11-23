import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from './inventory.service';

describe('InventoryService Performance', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockPrisma = {
    sale: { findMany: jest.fn() },
    inventory: { findMany: jest.fn() },
    // Add other mocks as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should handle generateAnalyticsReport under heavy load', async () => {
    // Simulate a large dataset
    const sales = Array.from({ length: 10000 }, (_, i) => ({ id: i + 1, total: Math.random() * 100 }));
    mockPrisma.sale.findMany.mockResolvedValue(sales);
    mockPrisma.inventory.findMany.mockResolvedValue([]);

    const dto = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      timeFrame: 'MONTHLY',
      reportType: 'SALES',
      includeDetails: true,
      groupByCategory: false,
      groupBySupplier: false,
    };

    const start = process.hrtime.bigint();
    const result = await service.generateAnalyticsReport(dto as any);
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    expect(result).toBeDefined();
    expect(durationMs).toBeLessThan(2000); // Should complete in under 2 seconds
    console.log(`Performance: generateAnalyticsReport took ${durationMs.toFixed(2)} ms for 10,000 sales records.`);
  });
}); 