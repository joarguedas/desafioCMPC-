import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from '../../src/authors/authors.controller';
import { AuthorsService } from '../../src/authors/authors.service';
import { CreateAuthorDto } from '../../src/authors/dto/create-author.dto';
import { UpdateAuthorDto } from '../../src/authors/dto/update-author.dto';
import { PaginationDto } from '../../src/common/dto/pagination.dto';

const mockAuthorResponse = {
  id: 1,
  name: 'Gabriel García Márquez',
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAuthorResponse),
            findAll: jest.fn().mockResolvedValue({ data: [mockAuthorResponse], total: 1 }),
            findOne: jest.fn().mockResolvedValue(mockAuthorResponse),
            update: jest.fn().mockResolvedValue(mockAuthorResponse),
            remove: jest.fn().mockResolvedValue({ message: 'Autor desactivado correctamente' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  it('debería crear un autor', async () => {
    const dto: CreateAuthorDto = { name: 'Gabriel García Márquez' };
    const result = await controller.create(dto, 1);
    expect(result).toEqual(mockAuthorResponse);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  it('debería listar autores con paginación', async () => {
    const dto: PaginationDto = { page: 1, limit: 10 };
    const result = await controller.findAll(dto);
    expect(result).toEqual({ data: [mockAuthorResponse], total: 1 });
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('debería obtener un autor por ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockAuthorResponse);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería actualizar un autor por ID', async () => {
    const dto: UpdateAuthorDto = { name: 'Gabo' };
    const result = await controller.update(1, dto, 1);
    expect(result).toEqual(mockAuthorResponse);
    expect(service.update).toHaveBeenCalledWith(1, dto, 1);
  });

  it('debería eliminar (desactivar) un autor por ID', async () => {
    const result = await controller.remove(1, 1);
    expect(result).toEqual({ message: 'Autor desactivado correctamente' });
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });
});
