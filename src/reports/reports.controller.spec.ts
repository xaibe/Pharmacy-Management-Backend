import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    generateSalesReport: jest.fn(),
    generateInventoryReport: jest.fn(),
    generateFinancialReport: jest.fn(),
    generateCustomerReport: jest.fn(),
    generateProductReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: mockReportsService },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateSalesReport', () => {
    it('should generate a sales report', async () => {
      const dto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const expected = { total: 1000 };
      mockReportsService.generateSalesReport.mockResolvedValue(expected);
      const result = await controller.generateSalesReport(dto as any);
      expect(result).toEqual(expected);
      expect(mockReportsService.generateSalesReport).toHaveBeenCalledWith(dto);
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate an inventory report', async () => {
      const expected = { totalStock: 500 };
      mockReportsService.generateInventoryReport.mockResolvedValue(expected);
      const result = await controller.generateInventoryReport();
      expect(result).toEqual(expected);
      expect(mockReportsService.generateInventoryReport).toHaveBeenCalled();
    });
  });

  describe('generateFinancialReport', () => {
    it('should generate a financial report', async () => {
      const dto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const expected = { totalExpenses: 200 };
      mockReportsService.generateFinancialReport.mockResolvedValue(expected);
      const result = await controller.generateFinancialReport(dto as any);
      expect(result).toEqual(expected);
      expect(mockReportsService.generateFinancialReport).toHaveBeenCalledWith(dto);
    });
  });

  describe('generateCustomerReport', () => {
    it('should generate a customer report', async () => {
      const dto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const expected = { totalCustomers: 10 };
      mockReportsService.generateCustomerReport.mockResolvedValue(expected);
      const result = await controller.generateCustomerReport(dto as any);
      expect(result).toEqual(expected);
      expect(mockReportsService.generateCustomerReport).toHaveBeenCalledWith(dto);
    });
  });

  describe('generateProductReport', () => {
    it('should generate a product report', async () => {
      const dto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const expected = { totalProducts: 20 };
      mockReportsService.generateProductReport.mockResolvedValue(expected);
      const result = await controller.generateProductReport(dto as any);
      expect(result).toEqual(expected);
      expect(mockReportsService.generateProductReport).toHaveBeenCalledWith(dto);
    });
  });
}); 