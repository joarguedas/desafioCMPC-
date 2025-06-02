import {
  Controller,
  Post,
  Body,
  HttpStatus,
  StreamableFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExportService } from './export.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Exportación')
@ApiBearerAuth('jwt')
@Roles('admin', 'superadmin')
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  @ApiOperation({ summary: 'Exporta registros en CSV y descarga el archivo' })
  @ApiResponse({
    status: 200,
    description: 'Archivo CSV generado exitosamente',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          example: 'books',
          description: 'Tipo de datos a exportar (books, logs, etc.)',
        },
        filters: {
          type: 'object',
          example: { status: true },
          description: 'Filtros opcionales para aplicar al exportar',
        },
      },
    },
  })
  async export(
    @Body() body: { type: string; filters?: any },
    @CurrentUser('userId') userId: number,
  ): Promise<StreamableFile> {
    const { type, filters = {} } = body;

    if (!type) {
      throw new BadRequestException('El campo "type" es obligatorio');
    }

    try {
      const { buffer, filename } = await this.exportService.exportAsBuffer({
        type,
        filters,
        userId,
      });

      return new StreamableFile(buffer, {
        disposition: `attachment; filename="${filename}"`,
        type: 'text/csv',
      });
    } catch (error) {
      // Puedes loguear si lo deseas: console.error('Error al exportar:', error);
      throw new InternalServerErrorException(
        'Error al exportar los datos: ' + error.message,
      );
    }
  }
}
