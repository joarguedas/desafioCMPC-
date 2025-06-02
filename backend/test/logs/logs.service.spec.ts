import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from '../../src/logs/logs.service';
import { getModelToken } from '@nestjs/sequelize';
import { Log } from '../../src/logs/entities/log.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('LogsService', () => {
  let service: LogsService;
  let mockLogModel: any;

  beforeEach(async () => {
    mockLogModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getModelToken(Log),
          useValue: mockLogModel,
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  describe('create', () => {
    it('debería crear un log correctamente', async () => {
      mockLogModel.create.mockResolvedValueOnce(undefined);
      await expect(service.create({ action: 'CREATE' })).resolves.toBeUndefined();
      expect(mockLogModel.create).toHaveBeenCalledWith({ action: 'CREATE' });
    });

    it('no debería lanzar excepción si falla internamente (solo loguea)', async () => {
      mockLogModel.create.mockRejectedValueOnce(new Error('Error DB'));
      await expect(service.create({ action: 'CREATE' })).resolves.toBeUndefined();
    });
  });

  describe('findAll', () => {
    const mockRows = [{ id: 1 }, { id: 2 }];
    const mockCount = 2;

    it('debería retornar logs con paginación', async () => {
      mockLogModel.findAndCountAll.mockResolvedValueOnce({
        rows: mockRows,
        count: mockCount,
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(mockLogModel.findAndCountAll).toHaveBeenCalled();
      expect(result).toEqual({ data: mockRows, total: mockCount });
    });

    it('debería aplicar filtros correctamente', async () => {
      mockLogModel.findAndCountAll.mockResolvedValueOnce({
        rows: [],
        count: 0,
      });

      const result = await service.findAll({
        userId: 1,
        tableName: 'books',
        action: 'CREATE',
        fromDate: '2024-01-01',
        toDate: '2024-12-31',
        page: 2,
        limit: 5,
      });

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('debería lanzar InternalServerErrorException si ocurre un error', async () => {
      mockLogModel.findAndCountAll.mockRejectedValueOnce(new Error('DB Error'));

      await expect(
        service.findAll({ page: 1, limit: 10 }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('debería retornar todo si all es true', async () => {
      mockLogModel.findAndCountAll.mockResolvedValueOnce({
        rows: mockRows,
        count: mockCount,
      });

      const result = await service.findAll({ all: true });

      expect(result).toEqual({ data: mockRows, total: mockCount });
    });
  });
});
