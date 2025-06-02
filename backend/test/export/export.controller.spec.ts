import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from 'src/export/export.controller';
import { ExportService } from 'src/export/export.service';
import { BadRequestException, InternalServerErrorException, StreamableFile } from '@nestjs/common';

describe('ExportController', () => {
  let controller: ExportController;
  let service: ExportService;

  const mockExportService = {
    exportAsBuffer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: mockExportService,
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
    service = module.get<ExportService>(ExportService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería exportar un archivo CSV correctamente', async () => {
    const mockBuffer = Buffer.from('data,csv');
    const mockFilename = 'export.csv';

    mockExportService.exportAsBuffer.mockResolvedValueOnce({
      buffer: mockBuffer,
      filename: mockFilename,
    });

    const result = await controller.export({ type: 'books' }, 1);

    expect(result).toBeInstanceOf(StreamableFile);
    expect(mockExportService.exportAsBuffer).toHaveBeenCalledWith({
      type: 'books',
      filters: {},
      userId: 1,
    });
  });

  it('debería lanzar BadRequestException si no se envía type', async () => {
    await expect(
      controller.export({ type: '' }, 1),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar InternalServerErrorException si el servicio falla', async () => {
    mockExportService.exportAsBuffer.mockRejectedValueOnce(
      new Error('Fallo interno'),
    );

    await expect(
      controller.export({ type: 'books' }, 1),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
