import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;
  let prisma: PrismaService;

  const mockPrisma = {
    sale: {
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
        SalesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale', async () => {
      const dto = { customerId: 1, items: [], total: 100 };
      const expected = { id: 1, ...dto };
      mockPrisma.sale.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.sale.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all sales', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.sale.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.sale.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a sale by id', async () => {
      const expected = { id: 1 };
      mockPrisma.sale.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.sale.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a sale', async () => {
      const dto = { total: 200 };
      const expected = { id: 1, ...dto };
      mockPrisma.sale.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.sale.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a sale', async () => {
      const expected = { id: 1 };
      mockPrisma.sale.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.sale.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 