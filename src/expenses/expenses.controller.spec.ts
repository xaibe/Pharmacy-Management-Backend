import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  const mockExpensesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        { provide: ExpensesService, useValue: mockExpensesService },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const dto = { title: 'Test Expense', amount: 100 };
      const expected = { id: 1, ...dto };
      mockExpensesService.create.mockResolvedValue(expected);
      const result = await controller.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockExpensesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all expenses', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockExpensesService.findAll.mockResolvedValue(expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
      expect(mockExpensesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const expected = { id: 1 };
      mockExpensesService.findOne.mockResolvedValue(expected);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
      expect(mockExpensesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const dto = { title: 'Updated Expense' };
      const expected = { id: 1, ...dto };
      mockExpensesService.update.mockResolvedValue(expected);
      const result = await controller.update('1', dto as any);
      expect(result).toEqual(expected);
      expect(mockExpensesService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      const expected = { id: 1 };
      mockExpensesService.remove.mockResolvedValue(expected);
      const result = await controller.remove('1');
      expect(result).toEqual(expected);
      expect(mockExpensesService.remove).toHaveBeenCalledWith('1');
    });
  });
}); 