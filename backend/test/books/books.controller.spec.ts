import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../../src/books/books.controller';
import { BooksService } from '../../src/books/books.service';
import { CreateBookDto } from '../../src/books/dto/create-book.dto';
import { UpdateBookDto } from '../../src/books/dto/update-book.dto';
import { FilterBooksDto } from '../../src/books/dto/filter-books.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('debería listar todos los libros', async () => {
    const result = { data: [], total: 0 };
    mockBooksService.findAll.mockResolvedValue(result);

    const filters: FilterBooksDto = {};
    expect(await controller.findAll(filters)).toBe(result);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('debería lanzar error si falla el servicio en findAll', async () => {
    mockBooksService.findAll.mockRejectedValue(new Error('DB error'));

    await expect(controller.findAll({})).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería obtener un libro por id', async () => {
    const book = { id: 1 };
    mockBooksService.findOne.mockResolvedValue(book);

    expect(await controller.findOne(1)).toBe(book);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería lanzar NotFound si no se encuentra el libro', async () => {
    mockBooksService.findOne.mockResolvedValue(null);

    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('debería crear un libro', async () => {
    const dto: CreateBookDto = {
      title: 'Nuevo libro',
      description: 'Descripción del libro',
      isbn: '123-456-789',
      stock: 10,
      price: 20,
      imageUrl: '/uploads/default.jpg',
      publishedAt: '2025-01-01',
      authorId: 1,
      genreId: 1,
      publisherId: 1,
    };
    const created = { id: 1, ...dto };
    mockBooksService.create.mockResolvedValue(created);

    expect(await controller.create(dto, 5)).toBe(created);
    expect(service.create).toHaveBeenCalledWith(dto, 5);
  });

  it('debería lanzar error si falla el servicio en create', async () => {
    mockBooksService.create.mockRejectedValue(new Error('DB error'));

    await expect(controller.create({} as CreateBookDto, 1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería actualizar un libro', async () => {
    const dto: UpdateBookDto = { title: 'Actualizado' };
    const updated = { id: 1, ...dto };
    mockBooksService.update.mockResolvedValue(updated);

    expect(await controller.update(1, dto, 2)).toBe(updated);
    expect(service.update).toHaveBeenCalledWith(1, dto, 2);
  });

  it('debería lanzar error si falla el servicio en update', async () => {
    mockBooksService.update.mockRejectedValue(new Error('DB error'));

    await expect(controller.update(1, {} as UpdateBookDto, 3)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería eliminar un libro', async () => {
    const result = { message: 'Libro desactivado correctamente' };
    mockBooksService.remove.mockResolvedValue(result);

    expect(await controller.remove(1, 4)).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(1, 4);
  });

  it('debería lanzar error si falla el servicio en remove', async () => {
    mockBooksService.remove.mockRejectedValue(new Error('DB error'));

    await expect(controller.remove(2, 6)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
