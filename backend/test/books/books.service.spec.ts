import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../../src/books/books.service';
import { getModelToken } from '@nestjs/sequelize';
import { Book } from '../../src/books/entities/book.entity';
import { LogsService } from '../../src/logs/logs.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let model: typeof Book;

  const mockBook = {
    id: 1,
    title: 'Test Book',
    imageUrl: '/uploads/default.jpg',
    toJSON: jest.fn().mockReturnValue({ id: 1, title: 'Test Book' }),
    update: jest.fn(),
  };

  const mockBookModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockLogsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getModelToken(Book), useValue: mockBookModel },
        { provide: LogsService, useValue: mockLogsService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<typeof Book>(getModelToken(Book));
  });

  it('debería retornar libros (findAll)', async () => {
    const result = { rows: [mockBook], count: 1 };
    mockBookModel.findAndCountAll.mockResolvedValueOnce(result);

    const filters = { page: 1, limit: 10 };
    const response = await service.findAll(filters);

    expect(response.total).toBe(1);
    expect(response.data).toHaveLength(1);
  });

  it('debería lanzar error si falla findAll', async () => {
    mockBookModel.findAndCountAll.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findAll({})).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería crear un libro', async () => {
    mockBookModel.create.mockResolvedValueOnce(mockBook);
    const dto = { title: 'Nuevo libro' };
    const result = await service.create(dto as any, 1);
    expect(result).toBe(mockBook);
  });

  it('debería lanzar error si falla create', async () => {
    mockBookModel.create.mockRejectedValueOnce(new Error('error'));
    await expect(service.create({} as any, 1)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería retornar un libro por ID', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(mockBook);
    const result = await service.findOne(1);
    expect(result).toBe(mockBook);
  });

  it('debería lanzar NotFoundException si no encuentra el libro', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un libro', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce({
      ...mockBook,
      update: jest.fn().mockResolvedValueOnce(true),
    });

    const dto = { title: 'Actualizado' };
    const result = await service.update(1, dto, 1);
    expect(result.id).toBe(1);
    expect(result.title).toBe('Test Book');
  });

  it('debería lanzar error si falla update', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce({
      ...mockBook,
      update: jest.fn().mockRejectedValueOnce(new Error('fail')),
    });

    await expect(service.update(1, {}, 1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería lanzar BadRequestException si no encuentra el libro en update', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(null);
    await expect(service.update(1, {}, 1)).rejects.toThrow(BadRequestException);
  });

  it('debería desactivar un libro', async () => {
    const updateFn = jest.fn().mockResolvedValueOnce(true);
    mockBookModel.findByPk.mockResolvedValueOnce({
      ...mockBook,
      update: updateFn,
    });

    const result = await service.remove(1, 1);
    expect(result).toEqual({ message: 'Libro desactivado correctamente' });
  });

  it('debería lanzar error si falla remove', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce({
      ...mockBook,
      update: jest.fn().mockRejectedValueOnce(new Error('fail')),
    });

    await expect(service.remove(1, 1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('debería lanzar BadRequestException si no encuentra el libro en remove', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(null);
    await expect(service.remove(99, 1)).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar InternalServerErrorException si no encuentra el libro en update', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(null);

    await expect(service.update(1, {}, 1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.update(1, {}, 1)).rejects.toThrow(
      'Error al actualizar libro',
    );
  });

  it('debería lanzar InternalServerErrorException si no encuentra el libro en remove', async () => {
    mockBookModel.findByPk.mockResolvedValueOnce(null);

    await expect(service.remove(99, 1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.remove(99, 1)).rejects.toThrow(
      'Error al eliminar libro',
    );
  });
});
