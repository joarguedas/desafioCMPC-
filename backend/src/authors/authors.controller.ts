import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthorResponseDto } from './dto/author-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Autores')
@ApiBearerAuth('jwt')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Crear un nuevo autor' })
  @ApiResponse({ status: 201, type: AuthorResponseDto })
  async create(
    @Body() dto: CreateAuthorDto,
    @CurrentUser('id') userId: number,
  ): Promise<AuthorResponseDto> {
    try {
      return await this.authorsService.create(dto, userId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  @Roles('user', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Listar todos los autores activos con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de autores',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Gabriel García Márquez',
            status: true,
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        total: 25,
      },
    },
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: AuthorResponseDto[]; total: number }> {
    try {
      return await this.authorsService.findAll(paginationDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Obtener un autor por ID' })
  @ApiParam({ name: 'id', description: 'ID del autor' })
  @ApiResponse({ status: 200, type: AuthorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AuthorResponseDto> {
    try {
      return await this.authorsService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Actualizar un autor por ID' })
  @ApiParam({ name: 'id', description: 'ID del autor' })
  @ApiResponse({ status: 200, type: AuthorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuthorDto,
    @CurrentUser('id') userId: number,
  ): Promise<AuthorResponseDto> {
    try {
      return await this.authorsService.update(id, dto, userId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Eliminar (desactivar) un autor por ID' })
  @ApiParam({ name: 'id', description: 'ID del autor' })
  @ApiResponse({ status: 200, description: 'Autor desactivado correctamente' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ): Promise<{ message: string }> {
    try {
      return await this.authorsService.remove(id, userId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
