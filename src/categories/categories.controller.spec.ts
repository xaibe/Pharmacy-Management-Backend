import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { name: 'Test Category' };
      const expected = { id: 1, ...dto };
      mockCategoriesService.create.mockResolvedValue(expected);
      const result = await controller.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      mockCategoriesService.findAll.mockResolvedValue(expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const expected = { id: 1 };
      mockCategoriesService.findOne.mockResolvedValue(expected);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto = { name: 'Updated Category' };
      const expected = { id: 1, ...dto };
      mockCategoriesService.update.mockResolvedValue(expected);
      const result = await controller.update('1', dto as any);
      expect(result).toEqual(expected);
      expect(mockCategoriesService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const expected = { id: 1 };
      mockCategoriesService.remove.mockResolvedValue(expected);
      const result = await controller.remove('1');
      expect(result).toEqual(expected);
      expect(mockCategoriesService.remove).toHaveBeenCalledWith('1');
    });
  });
}); 