import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let prisma: PrismaService;

  const mockPrisma = {
    invoice: {
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
        InvoicesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const dto = { customerId: 1, items: [], total: 100 };
      const expected = { id: 1, ...dto };
      mockPrisma.invoice.create.mockResolvedValue(expected);
      const result = await service.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.invoice.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockPrisma.invoice.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.invoice.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      const expected = { id: 1 };
      mockPrisma.invoice.findUnique.mockResolvedValue(expected);
      const result = await service.findOne(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.invoice.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const dto = { total: 200 };
      const expected = { id: 1, ...dto };
      mockPrisma.invoice.update.mockResolvedValue(expected);
      const result = await service.update(1, dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.invoice.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      const expected = { id: 1 };
      mockPrisma.invoice.delete.mockResolvedValue(expected);
      const result = await service.remove(1);
      expect(result).toEqual(expected);
      expect(mockPrisma.invoice.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
}); 