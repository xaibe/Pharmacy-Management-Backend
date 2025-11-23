import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChartType, MetricType, ReportType, TimeFrame } from './dto/analytics.dto';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockInventoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStock: jest.fn(),
    findLowStock: jest.fn(),
    findExpiringSoon: jest.fn(),
    generateAnalyticsReport: jest.fn(),
    generateVisualization: jest.fn(),
    exportReport: jest.fn(),
    getDashboardSummary: jest.fn(),
    trackPayments: jest.fn(),
    analyzeInventoryImpact: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      const createData = {
        name: 'Test Medicine',
        type: Type.MEDICINE,
        categoryId: 1,
        rackLocation: 'A1',
        wholeSalePrice: 10,
        retailPrice: 15,
        stock: 100,
        supplierId: 1,
      };

      const expectedResult = {
        id: 1,
        ...createData,
        category: { id: 1, name: 'Test Category' },
        supplier: { id: 1, supplierName: 'Test Supplier' },
      };

      mockInventoryService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createData);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Test Medicine',
          category: { id: 1, name: 'Test Category' },
          supplier: { id: 1, supplierName: 'Test Supplier' },
        },
      ];

      mockInventoryService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single inventory item', async () => {
      const expectedResult = {
        id: 1,
        name: 'Test Medicine',
        category: { id: 1, name: 'Test Category' },
        supplier: { id: 1, supplierName: 'Test Supplier' },
      };

      mockInventoryService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an inventory item', async () => {
      const updateData = {
        name: 'Updated Medicine',
        stock: 150,
      };

      const expectedResult = {
        id: 1,
        ...updateData,
        category: { id: 1, name: 'Test Category' },
        supplier: { id: 1, supplierName: 'Test Supplier' },
      };

      mockInventoryService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateData);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('remove', () => {
    it('should remove an inventory item', async () => {
      const expectedResult = {
        id: 1,
        name: 'Test Medicine',
      };

      mockInventoryService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(1);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('updateStock', () => {
    it('should update stock quantity', async () => {
      const expectedResult = {
        id: 1,
        stock: 150,
      };

      mockInventoryService.updateStock.mockResolvedValue(expectedResult);

      const result = await controller.updateStock(1, 50);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.updateStock).toHaveBeenCalledWith(1, 50);
    });
  });

  describe('findLowStock', () => {
    it('should return items with stock below threshold', async () => {
      const threshold = 10;
      const expectedResult = [
        {
          id: 1,
          name: 'Low Stock Medicine',
          stock: 5,
          category: { id: 1, name: 'Test Category' },
          supplier: { id: 1, supplierName: 'Test Supplier' },
        },
      ];

      mockInventoryService.findLowStock.mockResolvedValue(expectedResult);

      const result = await controller.findLowStock(threshold);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.findLowStock).toHaveBeenCalledWith(threshold);
    });
  });

  describe('findExpiringSoon', () => {
    it('should return items expiring within specified days', async () => {
      const days = 30;
      const expectedResult = [
        {
          id: 1,
          name: 'Expiring Medicine',
          expiryDate: new Date(),
          category: { id: 1, name: 'Test Category' },
          supplier: { id: 1, supplierName: 'Test Supplier' },
        },
      ];

      mockInventoryService.findExpiringSoon.mockResolvedValue(expectedResult);

      const result = await controller.findExpiringSoon(days);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.findExpiringSoon).toHaveBeenCalledWith(days);
    });
  });

  describe('generateAnalyticsReport', () => {
    it('should generate an analytics report', async () => {
      const reportDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        timeFrame: TimeFrame.MONTHLY,
        reportType: ReportType.SALES,
        includeDetails: true,
        groupByCategory: true,
        groupBySupplier: false,
      };

      const expectedResult = {
        period: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        timeFrame: TimeFrame.MONTHLY,
        reportType: ReportType.SALES,
        data: {},
      };

      mockInventoryService.generateAnalyticsReport.mockResolvedValue(expectedResult);

      const result = await controller.generateAnalyticsReport(reportDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.generateAnalyticsReport).toHaveBeenCalledWith(reportDto);
    });
  });

  describe('generateVisualization', () => {
    it('should generate visualization data', async () => {
      const visualizationDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        chartType: ChartType.LINE,
        metrics: [MetricType.SALES_VOLUME, MetricType.REVENUE],
        groupBy: 'category',
        includeTrend: true,
      };

      const expectedResult = {
        type: ChartType.LINE,
        data: {},
        metadata: {
          metrics: visualizationDto.metrics,
          period: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31'),
          },
          groupBy: 'category',
          includeTrend: true,
        },
      };

      mockInventoryService.generateVisualization.mockResolvedValue(expectedResult);

      const result = await controller.generateVisualization(visualizationDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.generateVisualization).toHaveBeenCalledWith(visualizationDto);
    });
  });

  describe('exportReport', () => {
    it('should export report', async () => {
      const exportDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        format: 'CSV',
        reportType: ReportType.SALES,
        includeHeaders: true,
        filename: 'sales_report.csv',
      };

      const expectedResult = {
        buffer: Buffer.from('test'),
        filename: 'sales_report.csv',
        contentType: 'text/csv',
      };

      mockInventoryService.exportReport.mockResolvedValue(expectedResult);

      const result = await controller.exportReport(exportDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.exportReport).toHaveBeenCalledWith(exportDto);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary', async () => {
      const summaryDto = {
        timeFrame: TimeFrame.MONTHLY,
        includeSales: true,
        includeInventory: true,
        includeFinancial: true,
        includePerformance: true,
      };

      const expectedResult = {
        sales: {},
        inventory: {},
        financial: {},
        performance: {},
      };

      mockInventoryService.getDashboardSummary.mockResolvedValue(expectedResult);

      const result = await controller.getDashboardSummary(summaryDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.getDashboardSummary).toHaveBeenCalledWith(summaryDto);
    });
  });

  describe('trackPayments', () => {
    it('should track payments', async () => {
      const trackingDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        includePending: true,
        includePaid: true,
        groupByMethod: true,
      };

      const expectedResult = {
        period: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        totalAmount: 1000,
        totalCount: 10,
        payments: {},
      };

      mockInventoryService.trackPayments.mockResolvedValue(expectedResult);

      const result = await controller.trackPayments(trackingDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.trackPayments).toHaveBeenCalledWith(trackingDto);
    });
  });

  describe('analyzeInventoryImpact', () => {
    it('should analyze inventory impact', async () => {
      const impactDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        includeMovements: true,
        includeExpiry: true,
        includeCost: true,
      };

      const expectedResult = {
        period: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        stockMovements: [],
        expiryAnalysis: [],
        costAnalysis: [],
      };

      mockInventoryService.analyzeInventoryImpact.mockResolvedValue(expectedResult);

      const result = await controller.analyzeInventoryImpact(impactDto);

      expect(result).toEqual(expectedResult);
      expect(mockInventoryService.analyzeInventoryImpact).toHaveBeenCalledWith(impactDto);
    });
  });
}); 