import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from '../../src/publishers/publishers.service';
import { getModelToken } from '@nestjs/sequelize';
import { LogsService } from '../../src/logs/logs.service';
import { Publisher } from '../../src/publishers/entities/publisher.entity';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('PublishersService', () => {
  let service: PublishersService;
  let model: any;
  let logsService: any;

  beforeEach(async () => {
    model = {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    logsService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        { provide: getModelToken(Publisher), useValue: model },
        { provide: LogsService, useValue: logsService },
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
  });

  describe('create', () => {
    it('debería lanzar error si la editorial ya existe', async () => {
      model.findOne.mockResolvedValue({ id: 1, name: 'Norma' });
      await expect(service.create({ name: 'Norma' }, 1)).rejects.toThrow(BadRequestException);
    });

    it('debería crear editorial exitosamente', async () => {
      const dto = { name: 'Nueva' };
      const created = { id: 1, name: 'Nueva', toJSON: () => dto };
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue(created);

      const result = await service.create(dto, 1);
      expect(result).toEqual(expect.objectContaining({ name: 'Nueva' }));
      expect(model.create).toHaveBeenCalledWith(dto);
    });

    it('debería lanzar error interno si falla al crear', async () => {
      model.findOne.mockResolvedValue(null);
      model.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create({ name: 'Algo' }, 1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('debería retornar lista de editoriales', async () => {
      const rows = [{ id: 1, name: 'X', toJSON: () => ({}) }];
      model.findAndCountAll.mockResolvedValue({ rows, count: 1 });

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
    });

    it('debería lanzar error si falla la consulta', async () => {
      model.findAndCountAll.mockRejectedValue(new Error('fail'));
      await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('debería retornar una editorial existente', async () => {
      model.findByPk.mockResolvedValue({ id: 1, name: 'X', toJSON: () => ({}) });
      const result = await service.findOne(1);
      expect(result).toBeDefined();
    });

    it('debería lanzar error si no existe', async () => {
      model.findByPk.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar correctamente', async () => {
      const updated = { id: 1, update: jest.fn(), toJSON: jest.fn().mockReturnValue({ id: 1 }) };
      model.findByPk.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'N' }, 2);
      expect(result.id).toBe(1);
      expect(updated.update).toHaveBeenCalledWith({ name: 'N' });
    });

    it('debería lanzar error si editorial no existe', async () => {
      model.findByPk.mockResolvedValue(null);
      await expect(service.update(99, { name: 'N' }, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería lanzar error si no encuentra editorial', async () => {
      model.findByPk.mockResolvedValue(undefined);
      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('debería desactivar correctamente la editorial', async () => {
      const instance = {
        id: 1,
        status: true,
        update: jest.fn(),
        toJSON: jest.fn().mockReturnValue({ id: 1 }),
      };
      model.findByPk.mockResolvedValue(instance);

      const result = await service.remove(1, 1);
      expect(result).toEqual({ message: 'Editorial desactivada correctamente' });
      expect(instance.update).toHaveBeenCalledWith({ status: false });
    });
  });
});
