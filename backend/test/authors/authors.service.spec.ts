import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../../src/authors/authors.service';
import { getModelToken } from '@nestjs/sequelize';
import { Author } from '../../src/authors/entities/author.entity';
import { LogsService } from '../../src/logs/logs.service';
import { CreateAuthorDto } from '../../src/authors/dto/create-author.dto';
import { UpdateAuthorDto } from '../../src/authors/dto/update-author.dto';
import { NotFoundException } from '@nestjs/common';

const mockAuthor = {
  id: 1,
  name: 'Autor Prueba',
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON() {
    return this;
  },
  update: jest.fn().mockResolvedValue(true),
};

describe('AuthorsService', () => {
  let service: AuthorsService;
  let model: typeof Author;
  let logsService: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author),
          useValue: {
            create: jest.fn().mockResolvedValue(mockAuthor),
            findAndCountAll: jest.fn().mockResolvedValue({ rows: [mockAuthor], count: 1 }),
            findByPk: jest.fn().mockResolvedValue(mockAuthor),
          },
        },
        {
          provide: LogsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    model = module.get<typeof Author>(getModelToken(Author));
    logsService = module.get<LogsService>(LogsService);
  });

  it('debería crear un autor', async () => {
    const dto: CreateAuthorDto = { name: 'Nuevo Autor' };
    const result = await service.create(dto, 1);
    expect(result.name).toBe('Autor Prueba');
  });

  it('debería listar autores con paginación', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.data[0].name).toBe('Autor Prueba');
  });

  it('debería obtener un autor por ID', async () => {
    const result = await service.findOne(1);
    expect(result.id).toBe(1);
  });

  it('debería lanzar NotFound si el autor no existe o está inactivo (findOne)', async () => {
    jest.spyOn(model, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un autor', async () => {
    const dto: UpdateAuthorDto = { name: 'Nombre Actualizado' };
    const result = await service.update(1, dto, 1);
    expect(result.name).toBe('Autor Prueba');
  });

  it('debería lanzar NotFound si el autor no existe o está inactivo (update)', async () => {
    jest.spyOn(model, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.update(1, { name: 'x' }, 1)).rejects.toThrow(NotFoundException);
  });

  it('debería desactivar un autor', async () => {
    const result = await service.remove(1, 1);
    expect(result.message).toBe('Autor eliminado correctamente');
  });

  it('debería lanzar NotFound si el autor no existe o está inactivo (remove)', async () => {
    jest.spyOn(model, 'findByPk').mockResolvedValueOnce(null);
    await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
  });
});
