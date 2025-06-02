// test/export/export.service.spec.ts
import { ExportService } from '../../src/export/export.service';
import { LogsService } from '../../src/logs/logs.service';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common';

describe('ExportService', () => {
  let service: ExportService;
  let mockLogsService: Partial<LogsService>;
  const mockUserId = 1;
  const mockFilters = { status: true };
  const mockBuffer = Buffer.from('title\nLibro de prueba');
  const mockFilename = 'books.csv';

  // Mock directo de handlers
  const mockHandlers = {
    books: jest.fn().mockResolvedValue({
      data: [{ title: 'Libro de prueba' }],
    }),
  };

  jest.mock('../../src/export/utils/generate-csv-buffer', () => ({
    generateCSVBuffer: jest.fn().mockResolvedValue({
      buffer: mockBuffer,
      filename: mockFilename,
    }),
  }));

  beforeEach(() => {
    mockLogsService = {
      create: jest.fn(),
    };

    service = new ExportService(mockHandlers as any, mockLogsService as LogsService);
  });

  it('debería exportar datos correctamente y retornar buffer y filename', async () => {
    const result = await service.exportAsBuffer({
      type: 'books',
      filters: mockFilters,
      userId: mockUserId,
    });

    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.filename).toBe(mockFilename);
    expect(mockHandlers.books).toHaveBeenCalledWith({ ...mockFilters, all: true });
  });

  it('debería lanzar BadRequestException si el tipo es inválido', async () => {
    await expect(
      service.exportAsBuffer({
        type: 'invalidType',
        filters: mockFilters,
        userId: mockUserId,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar InternalServerErrorException si el handler falla', async () => {
    const brokenHandlers = {
      books: jest.fn().mockRejectedValue(new Error('Fallo interno')),
    };

    const errorService = new ExportService(brokenHandlers as any, mockLogsService as LogsService);

    await expect(
      errorService.exportAsBuffer({
        type: 'books',
        filters: mockFilters,
        userId: mockUserId,
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
