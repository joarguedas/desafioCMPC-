// test/genres/genres.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from '../../src/genres/genres.controller';
import { GenresService } from '../../src/genres/genres.service';
import { CreateGenreDto } from '../../src/genres/dto/create-genre.dto';
import { UpdateGenreDto } from '../../src/genres/dto/update-genre.dto';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenre = {
    id: 1,
    name: 'Fantasía',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGenresService = {
    create: jest.fn().mockResolvedValue(mockGenre),
    findAll: jest.fn().mockResolvedValue({ data: [mockGenre], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockGenre),
    update: jest.fn().mockResolvedValue(mockGenre),
    remove: jest.fn().mockResolvedValue({ message: 'Género desactivado exitosamente' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [{ provide: GenresService, useValue: mockGenresService }],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un género', async () => {
    const dto: CreateGenreDto = { name: 'Fantasía' };
    const result = await controller.create(dto, 1);
    expect(result).toEqual(mockGenre);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  it('debería listar géneros con paginación', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({ data: [mockGenre], total: 1 });
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('debería obtener un género por ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockGenre);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería actualizar un género', async () => {
    const dto: UpdateGenreDto = { name: 'Fantasía Moderna' };
    const result = await controller.update(1, dto, 1);
    expect(result).toEqual(mockGenre);
    expect(service.update).toHaveBeenCalledWith(1, dto, 1);
  });

  it('debería eliminar (desactivar) un género', async () => {
    const result = await controller.remove(1, 1);
    expect(result).toEqual({ message: 'Género desactivado exitosamente' });
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });
});
