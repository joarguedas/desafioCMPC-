import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Publisher } from './entities/publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherResponseDto } from './dto/publisher-response.dto';
import { safeLog } from '../common/utils/safe-log.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { LogsService } from '../logs/logs.service';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class PublishersService {
  constructor(
    @InjectModel(Publisher)
    private readonly publisherModel: typeof Publisher,
    private readonly logsService: LogsService,
  ) {}

  async create(
    dto: CreatePublisherDto,
    userId?: number,
  ): Promise<PublisherResponseDto> {
    try {
      const existing = await this.publisherModel.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new BadRequestException('La editorial ya existe');
      }

      const publisher = await this.publisherModel.create(
        dto as CreationAttributes<Publisher>,
      );

      await safeLog(this.logsService, {
        userId,
        tableName: 'publishers',
        action: 'CREATE',
        recordId: publisher.id,
        dataBefore: undefined,
        dataAfter: publisher.toJSON(),
        status: 'success',
        description: 'Editorial creada correctamente',
      });

      return this.toResponseDto(publisher);
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'publishers',
        action: 'CREATE',
        status: 'error',
        description: 'Error al crear editorial: ' + error.message,
      });
      throw new InternalServerErrorException('Error al crear la editorial');
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: PublisherResponseDto[]; total: number }> {
    const { page = 1, limit = 10, all = false } = pagination;

    try {
      const queryOptions: any = {
        where: { status: true },
        order: [['createdAt', 'DESC']],
      };

      if (!all) {
        queryOptions.offset = (page - 1) * limit;
        queryOptions.limit = limit;
      }

      const { rows, count } =
        await this.publisherModel.findAndCountAll(queryOptions);

      return {
        data: rows.map(this.toResponseDto),
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener editoriales');
    }
  }

  async findOne(id: number): Promise<PublisherResponseDto> {
    const publisher = await this.publisherModel.findByPk(id);
    if (!publisher) {
      throw new NotFoundException('Editorial no encontrada');
    }
    return this.toResponseDto(publisher);
  }

  async update(
    id: number,
    dto: UpdatePublisherDto,
    userId?: number,
  ): Promise<PublisherResponseDto> {
    const publisher = await this.publisherModel.findByPk(id);
    if (!publisher) {
      throw new NotFoundException('Editorial no encontrada');
    }

    const before = publisher.toJSON();
    await publisher.update(dto);

    await safeLog(this.logsService, {
      userId,
      tableName: 'publishers',
      action: 'UPDATE',
      recordId: id,
      dataBefore: before,
      dataAfter: publisher.toJSON(),
      status: 'success',
      description: 'Editorial actualizada correctamente',
    });

    return this.toResponseDto(publisher);
  }

  async remove(id: number, userId?: number): Promise<{ message: string }> {
    const publisher = await this.publisherModel.findByPk(id);
    if (!publisher) {
      throw new NotFoundException('Editorial no encontrada');
    }

    const before = publisher.toJSON();
    await publisher.update({ status: false });

    await safeLog(this.logsService, {
      userId,
      tableName: 'publishers',
      action: 'DELETE',
      recordId: id,
      dataBefore: before,
      dataAfter: publisher.toJSON(),
      status: 'success',
      description: 'Editorial desactivada (soft delete)',
    });

    return { message: 'Editorial desactivada correctamente' };
  }

  private toResponseDto(publisher: Publisher): PublisherResponseDto {
    const { id, name, status, createdAt, updatedAt } = publisher;
    return { id, name, status, createdAt, updatedAt };
  }
}
