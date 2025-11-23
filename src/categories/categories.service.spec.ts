import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrisma = {
    category: {
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
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { name: 'Test Category' };
      const expected = { id: 1, ...dto };
      mockPrisma.category.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.category.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.category.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const expected = { id: 1 };
      mockPrisma.category.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto = { name: 'Updated Category' };
      const expected = { id: 1, ...dto };
      mockPrisma.category.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.category.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const expected = { id: 1 };
      mockPrisma.category.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 