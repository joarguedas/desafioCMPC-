import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';
import { safeLog } from '../common/utils/safe-log.util';
import { LogsService } from '../logs/logs.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author)
    private readonly authorModel: typeof Author,
    private readonly logsService: LogsService,
  ) {}

  async create(
    dto: CreateAuthorDto,
    userId?: number,
  ): Promise<AuthorResponseDto> {
    try {
      const author = await this.authorModel.create(
        dto as CreationAttributes<Author>,
      );

      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'CREATE',
        recordId: author.id,
        dataBefore: undefined,
        dataAfter: author.toJSON(),
        status: 'success',
        description: 'Autor creado correctamente',
      });

      return this.toResponseDto(author);
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'CREATE',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: 'Error al crear autor: ' + error.message,
      });
      throw new InternalServerErrorException(
        'Error al crear el autor: ' + error.message,
      );
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: AuthorResponseDto[]; total: number }> {
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
        await this.authorModel.findAndCountAll(queryOptions);

      return {
        data: rows.map(this.toResponseDto),
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener autores: ' + error.message,
      );
    }
  }

  async findOne(id: number): Promise<AuthorResponseDto> {
    try {
      const author = await this.authorModel.findByPk(id);
      if (!author || !author.status) {
        throw new NotFoundException('Autor no encontrado');
      }
      return this.toResponseDto(author);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el autor: ' + error.message,
      );
    }
  }

  async update(
    id: number,
    dto: UpdateAuthorDto,
    userId?: number,
  ): Promise<AuthorResponseDto> {
    try {
      const author = await this.authorModel.findByPk(id);
      if (!author || !author.status) {
        throw new NotFoundException('Autor no encontrado');
      }

      const before = author.toJSON();
      await author.update(dto);

      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'UPDATE',
        recordId: id,
        dataBefore: before,
        dataAfter: author.toJSON(),
        status: 'success',
        description: 'Autor actualizado correctamente',
      });

      return this.toResponseDto(author);
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'UPDATE',
        recordId: id,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: 'Error al actualizar autor: ' + error.message,
      });
      throw new InternalServerErrorException(
        'Error al actualizar el autor: ' + error.message,
      );
    }
  }

  async remove(id: number, userId?: number): Promise<{ message: string }> {
    try {
      const author = await this.authorModel.findByPk(id);
      if (!author || !author.status) {
        throw new NotFoundException('Autor no encontrado');
      }

      const before = author.toJSON();
      await author.update({ status: false });

      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'DELETE',
        recordId: id,
        dataBefore: before,
        dataAfter: author.toJSON(),
        status: 'success',
        description: 'Autor eliminado (desactivado) correctamente',
      });

      return { message: 'Autor eliminado correctamente' };
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'authors',
        action: 'DELETE',
        recordId: id,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: 'Error al eliminar autor: ' + error.message,
      });
      throw new InternalServerErrorException(
        'Error al eliminar el autor: ' + error.message,
      );
    }
  }

  private toResponseDto(author: Author): AuthorResponseDto {
    const { id, name, status, createdAt, updatedAt } = author;
    return { id, name, status, createdAt, updatedAt };
  }
}
