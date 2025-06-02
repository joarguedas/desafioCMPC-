import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @InjectModel(Log)
    private readonly logModel: typeof Log,
  ) {}

  async create(createLogDto: Partial<Log>): Promise<void> {
    try {
      await this.logModel.create(createLogDto as CreationAttributes<Log>);
    } catch (error) {
      this.logger.error('Error al crear log', error.stack);

    }
  }

  async findAll(
    filters: FilterLogsDto & { all?: boolean },
  ): Promise<{ data: Log[]; total: number }> {
    const {
      userId,
      tableName,
      action,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      all = false,
    } = filters;

    const where: any = {};
    if (userId) where.userId = userId;
    if (tableName) where.tableName = tableName;
    if (action) where.action = action;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt['$gte'] = new Date(fromDate);
      if (toDate) where.createdAt['$lte'] = new Date(toDate);
    }

    const query: any = {
      where,
      order: [['createdAt', 'DESC']],
      include: ['user'],
    };

    if (!all) {
      query.offset = (page - 1) * limit;
      query.limit = limit;
    }

    try {
      const { rows, count } = await this.logModel.findAndCountAll(query);
      return { data: rows, total: count };
    } catch (error) {
      this.logger.error('Error al consultar logs', error.stack);
      throw new InternalServerErrorException('Error al obtener los logs');
    }
  }
}
