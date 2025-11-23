import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockInvoicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        { provide: InvoicesService, useValue: mockInvoicesService },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const dto = { customerId: 1, items: [], total: 100 };
      const expected = { id: 1, ...dto };
      mockInvoicesService.create.mockResolvedValue(expected);
      const result = await controller.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockInvoicesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockInvoicesService.findAll.mockResolvedValue(expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
      expect(mockInvoicesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      const expected = { id: 1 };
      mockInvoicesService.findOne.mockResolvedValue(expected);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
      expect(mockInvoicesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const dto = { total: 200 };
      const expected = { id: 1, ...dto };
      mockInvoicesService.update.mockResolvedValue(expected);
      const result = await controller.update('1', dto as any);
      expect(result).toEqual(expected);
      expect(mockInvoicesService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      const expected = { id: 1 };
      mockInvoicesService.remove.mockResolvedValue(expected);
      const result = await controller.remove('1');
      expect(result).toEqual(expected);
      expect(mockInvoicesService.remove).toHaveBeenCalledWith('1');
    });
  });
}); 