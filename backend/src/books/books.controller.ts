import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BookResponseDto } from './dto/book-response.dto';

@ApiTags('Libros')
@ApiBearerAuth('jwt')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles('user', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Listar libros con filtros, paginación o exportación (all)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'genreId', required: false, type: Number })
  @ApiQuery({ name: 'authorId', required: false, type: Number })
  @ApiQuery({ name: 'publisherId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Listado de libros', type: [BookResponseDto] })
  async findAll(@Query() filters: FilterBooksDto) {
    try {
      const result = await this.booksService.findAll(filters);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los libros');
    }
  }

  @Get(':id')
  @Roles('user', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Obtener un libro por ID' })
  @ApiResponse({ status: 200, type: BookResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }
    return book;
  }

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Crear un nuevo libro' })
  @ApiResponse({ status: 201, description: 'Libro creado correctamente' })
  async create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser('userId') userId: number,
  ) {
    try {
      return await this.booksService.create(createBookDto, userId);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el libro');
    }
  }

  @Put(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Actualizar un libro existente' })
  @ApiResponse({ status: 200, description: 'Libro actualizado correctamente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser('userId') userId: number,
  ) {
    try {
      return await this.booksService.update(id, updateBookDto, userId);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el libro');
    }
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Eliminar (soft delete) un libro' })
  @ApiResponse({ status: 200, description: 'Libro eliminado correctamente' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    try {
      return await this.booksService.remove(id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el libro');
    }
  }
}
