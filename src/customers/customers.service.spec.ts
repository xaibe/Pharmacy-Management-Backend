import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  const mockPrisma = {
    customer: {
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
        CustomersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto = { name: 'Test Customer', phone: '1234567890' };
      const expected = { id: 1, ...dto };
      mockPrisma.customer.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.customer.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.customer.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const expected = { id: 1 };
      mockPrisma.customer.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const dto = { name: 'Updated Customer' };
      const expected = { id: 1, ...dto };
      mockPrisma.customer.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.customer.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const expected = { id: 1 };
      mockPrisma.customer.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 