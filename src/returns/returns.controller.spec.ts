import { Test, TestingModule } from '@nestjs/testing';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';

describe('ReturnsController', () =>
{
    let controller: ReturnsController;
    let service: ReturnsService;

    const mockReturnsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReturnsController],
            providers: [
                { provide: ReturnsService, useValue: mockReturnsService },
            ],
        }).compile();

        controller = module.get<ReturnsController>(ReturnsController);
        service = module.get<ReturnsService>(ReturnsService);
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    it('should be defined', () =>
    {
        expect(controller).toBeDefined();
    });

    describe('create', () =>
    {
        it('should create a return', async () =>
        {
            const dto = { saleId: 1, items: [], total: 100 };
            const expected = { id: 1, ...dto };
            mockReturnsService.create.mockResolvedValue(expected);
            const result = await controller.create(dto as any);
            expect(result).toEqual(expected);
            expect(mockReturnsService.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () =>
    {
        it('should return all returns', async () =>
        {
            const expected = [{ id: 1 }, { id: 2 }];
            mockReturnsService.findAll.mockResolvedValue(expected);
            const result = await controller.findAll();
            expect(result).toEqual(expected);
            expect(mockReturnsService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () =>
    {
        it('should return a return by id', async () =>
        {
            const expected = { id: 1 };
            mockReturnsService.findOne.mockResolvedValue(expected);
            const result = await controller.findOne('1');
            expect(result).toEqual(expected);
            expect(mockReturnsService.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () =>
    {
        it('should update a return', async () =>
        {
            const dto = { total: 200 };
            const expected = { id: 1, ...dto };
            mockReturnsService.update.mockResolvedValue(expected);
            const result = await controller.update('1', dto as any);
            expect(result).toEqual(expected);
            expect(mockReturnsService.update).toHaveBeenCalledWith('1', dto);
        });
    });

    describe('remove', () =>
    {
        it('should delete a return', async () =>
        {
            const expected = { id: 1 };
            mockReturnsService.remove.mockResolvedValue(expected);
            const result = await controller.remove('1');
            expect(result).toEqual(expected);
            expect(mockReturnsService.remove).toHaveBeenCalledWith('1');
        });
    });
});
