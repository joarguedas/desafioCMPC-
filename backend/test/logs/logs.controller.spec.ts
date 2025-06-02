// test/logs/logs.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from '../../src/logs/logs.controller';
import { LogsService } from '../../src/logs/logs.service';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { FilterLogsDto } from '../../src/logs/dto/filter-logs.dto';

describe('LogsController', () => {
  let controller: LogsController;
  let service: LogsService;

  const mockLogsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [{ provide: LogsService, useValue: mockLogsService }],
    }).compile();

    controller = module.get<LogsController>(LogsController);
    service = module.get<LogsService>(LogsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería retornar logs si el usuario tiene rol admin o superadmin', async () => {
    const user = { role: 'admin' };
    const req: any = { user };
    const filters: FilterLogsDto = {};
    const mockLogs = [{ id: 1 }, { id: 2 }];

    mockLogsService.findAll.mockResolvedValueOnce(mockLogs);

    const result = await controller.findAll(req, filters);

    expect(service.findAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockLogs);
  });

  it('debería lanzar ForbiddenException si el usuario no es admin ni superadmin', async () => {
    const req: any = { user: { role: 'user' } };
    const filters: FilterLogsDto = {};

    await expect(controller.findAll(req, filters)).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar InternalServerErrorException si el servicio lanza error', async () => {
    const req: any = { user: { role: 'admin' } };
    const filters: FilterLogsDto = {};
    mockLogsService.findAll.mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.findAll(req, filters)).rejects.toThrow(InternalServerErrorException);
  });
});
