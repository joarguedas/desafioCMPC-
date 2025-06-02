// test/genres/genres.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from '../../src/genres/genres.service';
import { getModelToken } from '@nestjs/sequelize';
import { Genre } from '../../src/genres/entities/genre.entity';
import { LogsService } from '../../src/logs/logs.service';
import { CreateGenreDto } from '../../src/genres/dto/create-genre.dto';
import { UpdateGenreDto } from '../../src/genres/dto/update-genre.dto';
import { NotFoundException } from '@nestjs/common';

describe('GenresService', () => {
  let service: GenresService;

  const mockGenre = {
    id: 1,
    name: 'Fantasía',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: function () {
      return { ...this };
    },
    update: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  const genreModel = {
    create: jest.fn().mockResolvedValue(mockGenre),
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [mockGenre], count: 1 }),
    findByPk: jest.fn().mockResolvedValue(mockGenre),
  };

  const logsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: getModelToken(Genre), useValue: genreModel },
        { provide: LogsService, useValue: logsService },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un género', async () => {
    const dto: CreateGenreDto = { name: 'Fantasía' };
    const result = await service.create(dto, 1);
    expect(result.name).toBe('Fantasía');
    expect(genreModel.create).toHaveBeenCalledWith(expect.objectContaining(dto));
  });

  it('debería listar géneros con paginación', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.data[0].name).toBe('Fantasía');
    expect(genreModel.findAndCountAll).toHaveBeenCalled();
  });

  it('debería obtener un género por ID', async () => {
    const result = await service.findOne(1);
    expect(result.name).toBe('Fantasía');
    expect(genreModel.findByPk).toHaveBeenCalledWith(1);
  });

  it('debería lanzar NotFoundException si el género no existe (findOne)', async () => {
    jest.spyOn(genreModel, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un género', async () => {
    const dto: UpdateGenreDto = { name: 'Fantasía Moderna' };
    const result = await service.update(1, dto, 1);
    expect(mockGenre.update).toHaveBeenCalledWith(dto);
    expect(result.name).toBe('Fantasía');
  });

  it('debería lanzar NotFoundException si el género no existe (update)', async () => {
    jest.spyOn(genreModel, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.update(999, { name: 'X' }, 1)).rejects.toThrow(NotFoundException);
  });

  it('debería desactivar un género', async () => {
    const result = await service.remove(1, 1);
    expect(mockGenre.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Género desactivado correctamente' });
  });

  it('debería lanzar NotFoundException si el género no existe (remove)', async () => {
    jest.spyOn(genreModel, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
  });
});
