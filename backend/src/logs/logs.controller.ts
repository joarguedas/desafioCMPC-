import {
  Controller,
  Get,
  Query,
  InternalServerErrorException,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { FilterLogsDto } from './dto/filter-logs.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Log } from './entities/log.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Logs')
@ApiBearerAuth('jwt')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar logs con filtros avanzados (solo admin)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'tableName', required: false, type: String })
  @ApiQuery({
    name: 'action',
    required: false,
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'],
  })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs filtrados (solo admin o superadmin)',
    type: [Log],
  })
  async findAll(@Req() req: Request, @Query() filters: FilterLogsDto) {
    const user: any = req.user;

    if (!['admin', 'superadmin'].includes(user.role)) {
      throw new ForbiddenException('Acceso denegado: solo para administradores');
    }

    try {
      return await this.logsService.findAll(filters);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo obtener la lista de logs');
    }
  }
}
