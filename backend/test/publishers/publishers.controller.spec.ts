import { Test, TestingModule } from '@nestjs/testing';
import { PublishersController } from '../../src/publishers/publishers.controller';
import { PublishersService } from '../../src/publishers/publishers.service';
import { CreatePublisherDto } from '../../src/publishers/dto/create-publisher.dto';
import { UpdatePublisherDto } from '../../src/publishers/dto/update-publisher.dto';
import { PaginationDto } from '../../src/common/dto/pagination.dto';

describe('PublishersController', () => {
  let controller: PublishersController;
  let service: PublishersService;

  const mockPublisher = {
    id: 1,
    name: 'Editorial Planeta',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPublisher),
    findAll: jest.fn().mockResolvedValue({ data: [mockPublisher], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockPublisher),
    update: jest.fn().mockResolvedValue(mockPublisher),
    remove: jest.fn().mockResolvedValue({ message: 'Editorial desactivada correctamente' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
      providers: [
        {
          provide: PublishersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PublishersController>(PublishersController);
    service = module.get<PublishersService>(PublishersService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear una editorial', async () => {
    const dto: CreatePublisherDto = { name: 'Planeta' };
    const result = await controller.create(dto, 1);
    expect(result).toEqual(mockPublisher);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  it('debería retornar todas las editoriales con paginación', async () => {
    const pagination: PaginationDto = { page: 1, limit: 10 };
    const result = await controller.findAll(pagination);
    expect(result).toEqual({ data: [mockPublisher], total: 1 });
    expect(service.findAll).toHaveBeenCalledWith(pagination);
  });

  it('debería retornar una editorial por ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockPublisher);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería actualizar una editorial', async () => {
    const dto: UpdatePublisherDto = { name: 'Nueva Planeta' };
    const result = await controller.update(1, dto, 2);
    expect(result).toEqual(mockPublisher);
    expect(service.update).toHaveBeenCalledWith(1, dto, 2);
  });

  it('debería desactivar una editorial', async () => {
    const result = await controller.remove(1, 3);
    expect(result).toEqual({ message: 'Editorial desactivada correctamente' });
    expect(service.remove).toHaveBeenCalledWith(1, 3);
  });
});
