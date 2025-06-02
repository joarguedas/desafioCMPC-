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
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Publisher } from './entities/publisher.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { PublisherResponseDto } from './dto/publisher-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Publishers')
@ApiBearerAuth('jwt')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Crear una nueva editorial' })
  @ApiResponse({ status: 201, description: 'Editorial creada', type: Publisher })
  async create(
    @Body() createPublisherDto: CreatePublisherDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.publishersService.create(createPublisherDto, userId);
  }

  @Get()
  @Roles('user', 'admin', 'superadmin')
  @ApiOperation({ summary: 'Listar todas las editoriales activas con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de editoriales activas',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Planeta',
            status: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 20,
      },
    },
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: PublisherResponseDto[]; total: number }> {
    return this.publishersService.findAll(paginationDto);
  }


  @Get(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Obtener una editorial por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Editorial encontrada', type: Publisher })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publishersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Actualizar una editorial' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Editorial actualizada', type: Publisher })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublisherDto: UpdatePublisherDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.publishersService.update(id, updatePublisherDto, userId);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Desactivar una editorial (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Editorial desactivada correctamente' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.publishersService.remove(id, userId);
  }
}
