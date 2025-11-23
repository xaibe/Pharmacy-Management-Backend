import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';

describe('SuppliersController', () => {
  let controller: SuppliersController;
  let service: SuppliersService;

  const mockSuppliersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        { provide: SuppliersService, useValue: mockSuppliersService },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
    service = module.get<SuppliersService>(SuppliersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a supplier', async () => {
      const dto = { supplierName: 'Test Supplier', contact: '1234567890' };
      const expected = { id: 1, ...dto };
      mockSuppliersService.create.mockResolvedValue(expected);
      const result = await controller.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockSuppliersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockSuppliersService.findAll.mockResolvedValue(expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
      expect(mockSuppliersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a supplier by id', async () => {
      const expected = { id: 1 };
      mockSuppliersService.findOne.mockResolvedValue(expected);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
      expect(mockSuppliersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a supplier', async () => {
      const dto = { supplierName: 'Updated Supplier' };
      const expected = { id: 1, ...dto };
      mockSuppliersService.update.mockResolvedValue(expected);
      const result = await controller.update('1', dto as any);
      expect(result).toEqual(expected);
      expect(mockSuppliersService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a supplier', async () => {
      const expected = { id: 1 };
      mockSuppliersService.remove.mockResolvedValue(expected);
      const result = await controller.remove('1');
      expect(result).toEqual(expected);
      expect(mockSuppliersService.remove).toHaveBeenCalledWith('1');
    });
  });
}); 