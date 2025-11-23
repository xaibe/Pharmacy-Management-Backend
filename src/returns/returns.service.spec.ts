import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReturnsService } from './returns.service';

describe('ReturnsService', () => {
  let service: ReturnsService;
  let prisma: PrismaService;

  const mockPrisma = {
    return: {
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
        ReturnsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReturnsService>(ReturnsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a return', async () => {
      const dto = { saleId: 1, items: [], total: 100 };
      const expected = { id: 1, ...dto };
      mockPrisma.return.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.return.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all returns', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.return.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.return.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a return by id', async () => {
      const expected = { id: 1 };
      mockPrisma.return.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.return.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a return', async () => {
      const dto = { total: 200 };
      const expected = { id: 1, ...dto };
      mockPrisma.return.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.return.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a return', async () => {
      const expected = { id: 1 };
      mockPrisma.return.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.return.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 