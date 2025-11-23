import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseOrdersService } from './purchase-orders.service';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;
  let prisma: PrismaService;

  const mockPrisma = {
    purchaseOrder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Add other mocks as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a purchase order', async () => {
      const dto = { supplierId: 1, items: [], total: 100 };
      const expected = { id: 1, ...dto };
      mockPrisma.purchaseOrder.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.purchaseOrder.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all purchase orders', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.purchaseOrder.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.purchaseOrder.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a purchase order by id', async () => {
      const expected = { id: 1 };
      mockPrisma.purchaseOrder.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.purchaseOrder.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a purchase order', async () => {
      const dto = { total: 200 };
      const expected = { id: 1, ...dto };
      mockPrisma.purchaseOrder.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.purchaseOrder.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a purchase order', async () => {
      const expected = { id: 1 };
      mockPrisma.purchaseOrder.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.purchaseOrder.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 