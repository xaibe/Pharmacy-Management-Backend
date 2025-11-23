import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SuppliersService } from './suppliers.service';

describe('SuppliersService', () => {
  let service: SuppliersService;
  let prisma: PrismaService;

  const mockPrisma = {
    supplier: {
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
        SuppliersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a supplier', async () => {
      const dto = { supplierName: 'Test Supplier', contact: '1234567890' };
      const expected = { id: 1, ...dto };
      mockPrisma.supplier.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.supplier.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.supplier.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.supplier.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a supplier by id', async () => {
      const expected = { id: 1 };
      mockPrisma.supplier.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.supplier.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a supplier', async () => {
      const dto = { supplierName: 'Updated Supplier' };
      const expected = { id: 1, ...dto };
      mockPrisma.supplier.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.supplier.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a supplier', async () => {
      const expected = { id: 1 };
      mockPrisma.supplier.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.supplier.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 