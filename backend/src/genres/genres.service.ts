import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { safeLog } from '../common/utils/safe-log.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { LogsService } from '../logs/logs.service';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private readonly genreModel: typeof Genre,
    private readonly logsService: LogsService,
  ) {}

  async create(
    createGenreDto: CreateGenreDto,
    userId?: number,
  ): Promise<GenreResponseDto> {
    try {
      const genre = await this.genreModel.create(
        createGenreDto as CreationAttributes<Genre>,
      );

      await safeLog(this.logsService, {
        userId,
        tableName: 'genres',
        action: 'CREATE',
        recordId: genre.id,
        dataBefore: undefined,
        dataAfter: genre.toJSON(),
        status: 'success',
        description: 'Género creado correctamente',
      });

      return this.toResponseDto(genre);
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'genres',
        action: 'CREATE',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: 'Error al crear género: ' + error.message,
      });

      throw new InternalServerErrorException(
        'Error al crear el género: ' + error.message,
      );
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: GenreResponseDto[]; total: number }> {
    const { page = 1, limit = 10, all = false } = paginationDto;

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
        await this.genreModel.findAndCountAll(queryOptions);

      return {
        data: rows.map(this.toResponseDto),
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los géneros: ' + error.message,
      );
    }
  }

  async findOne(id: number): Promise<GenreResponseDto> {
    const genre = await this.genreModel.findByPk(id);
    if (!genre || !genre.status) {
      throw new NotFoundException('Género no encontrado');
    }
    return this.toResponseDto(genre);
  }

  async update(
    id: number,
    updateGenreDto: UpdateGenreDto,
    userId?: number,
  ): Promise<GenreResponseDto> {
    const genre = await this.genreModel.findByPk(id);
    if (!genre || !genre.status) {
      throw new NotFoundException('Género no encontrado');
    }

    const dataBefore = genre.toJSON();
    await genre.update(updateGenreDto);

    await safeLog(this.logsService, {
      userId,
      tableName: 'genres',
      action: 'UPDATE',
      recordId: id,
      dataBefore,
      dataAfter: genre.toJSON(),
      status: 'success',
      description: 'Género actualizado correctamente',
    });

    return this.toResponseDto(genre);
  }

  async remove(id: number, userId?: number): Promise<{ message: string }> {
    const genre = await this.genreModel.findByPk(id);
    if (!genre || !genre.status) {
      throw new NotFoundException('Género no encontrado');
    }

    const dataBefore = genre.toJSON();
    genre.status = false;
    await genre.save();

    await safeLog(this.logsService, {
      userId,
      tableName: 'genres',
      action: 'DELETE',
      recordId: id,
      dataBefore,
      dataAfter: genre.toJSON(),
      status: 'success',
      description: 'Género desactivado correctamente',
    });

    return { message: 'Género desactivado correctamente' };
  }

  private toResponseDto(genre: Genre): GenreResponseDto {
    const { id, name, status, createdAt, updatedAt } = genre;
    return { id, name, status, createdAt, updatedAt };
  }
}
