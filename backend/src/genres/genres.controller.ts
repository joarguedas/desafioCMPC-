import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GenreResponseDto } from './dto/genre-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Géneros')
@ApiBearerAuth('jwt')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Crear un nuevo género literario' })
  @ApiResponse({
    status: 201,
    description: 'Género creado exitosamente',
    type: GenreResponseDto,
  })
  async create(
    @Body() createGenreDto: CreateGenreDto,
    @CurrentUser('id') userId: number,
  ): Promise<GenreResponseDto> {
    return this.genresService.create(createGenreDto, userId);
  }

  @Get()
  @Roles('user', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Listar todos los géneros activos con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de géneros',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Fantasía',
            status: true,
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        total: 15,
      },
    },
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: GenreResponseDto[]; total: number }> {
    return this.genresService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Obtener un género por ID' })
  @ApiParam({ name: 'id', description: 'ID del género' })
  @ApiResponse({
    status: 200,
    description: 'Género encontrado',
    type: GenreResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GenreResponseDto> {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Actualizar un género existente' })
  @ApiParam({ name: 'id', description: 'ID del género' })
  @ApiResponse({
    status: 200,
    description: 'Género actualizado exitosamente',
    type: GenreResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
    @CurrentUser('id') userId: number,
  ): Promise<GenreResponseDto> {
    return this.genresService.update(id, updateGenreDto, userId);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Eliminar (desactivar) un género' })
  @ApiParam({ name: 'id', description: 'ID del género' })
  @ApiResponse({
    status: 200,
    description: 'Género desactivado exitosamente',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ): Promise<{ message: string }> {
    return this.genresService.remove(id, userId);
  }
}
