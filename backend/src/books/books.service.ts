import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { safeLog } from '../common/utils/safe-log.util';
import { LogsService } from '../logs/logs.service';
import { FindOptions, WhereOptions, CreationAttributes } from 'sequelize';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book) private readonly bookModel: typeof Book,
    private readonly logsService: LogsService,
  ) {}

  async findAll(filters: any): Promise<{ data: Book[]; total: number }> {
    const {
      authorId,
      genreId,
      publisherId,
      page = 1,
      limit = 10,
      all = false,
    } = filters;

    const where: any = { status: true };
    if (authorId) where.authorId = authorId;
    if (genreId) where.genreId = genreId;
    if (publisherId) where.publisherId = publisherId;

    const query: any = {
      where,
      include: ['author', 'genre', 'publisher'],
      order: [['createdAt', 'DESC']],
    };

    if (!all) {
      query.limit = limit;
      query.offset = (page - 1) * limit;
    }

    try {
      const { count, rows } = await this.bookModel.findAndCountAll(query);
      return { data: rows, total: count };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los libros: ' + error.message,
      );
    }
  }

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    try {
      const imageUrl = createBookDto.imageUrl?.trim() || '/uploads/default.jpg';

      const book = await this.bookModel.create({
        ...(createBookDto as CreationAttributes<Book>),
        imageUrl,
        created_by: userId,
        updated_by: userId,
      });

      await safeLog(this.logsService, {
        userId,
        action: 'CREATE',
        tableName: 'books',
        recordId: book.id,
        status: 'success',
        dataAfter: book.toJSON(),
      });

      return book;
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        action: 'CREATE',
        tableName: 'books',
        recordId: undefined,
        status: 'error',
        description: 'Error al crear libro: ' + error.message,
        dataAfter: createBookDto,
      });
      throw new BadRequestException('Error al crear libro: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateBookDto, userId: number): Promise<Book> {
    try {
      const book = await this.bookModel.findByPk(id);
      if (!book) throw new BadRequestException('Libro no encontrado');

      const before = book.toJSON();
      await book.update({
        ...dto,
        imageUrl:
          dto.imageUrl?.trim() ?? book.imageUrl ?? '/uploads/default.jpg',
        updated_by: userId,
      });

      await safeLog(this.logsService, {
        userId,
        action: 'UPDATE',
        tableName: 'books',
        recordId: id,
        dataBefore: before,
        dataAfter: book.toJSON(),
        status: 'success',
      });

      return book;
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        action: 'UPDATE',
        tableName: 'books',
        recordId: id,
        status: 'error',
        description: 'Error al actualizar libro: ' + error.message,
      });
      throw new InternalServerErrorException('Error al actualizar libro');
    }
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookModel.findByPk(id, {
      include: ['author', 'genre', 'publisher'],
    });

    if (!book) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }

    return book;
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    try {
      const book = await this.bookModel.findByPk(id);
      if (!book) throw new BadRequestException('Libro no encontrado');

      const before = book.toJSON();
      await book.update({ status: false, updated_by: userId });

      await safeLog(this.logsService, {
        userId,
        action: 'DELETE',
        tableName: 'books',
        recordId: id,
        dataBefore: before,
        status: 'success',
      });
      return { message: 'Libro desactivado correctamente' };
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        action: 'DELETE',
        tableName: 'books',
        recordId: id,
        status: 'error',
        description: 'Error al eliminar libro: ' + error.message,
      });
      throw new InternalServerErrorException('Error al eliminar libro');
    }
  }
}
