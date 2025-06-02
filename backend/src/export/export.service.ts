import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ExportHandlers } from './utils/export-handlers';
import { generateCSVBuffer } from './utils/generate-csv-buffer';
import { safeLog } from '../common/utils/safe-log.util';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ExportService {
  constructor(
    private readonly handlers: ExportHandlers,
    private readonly logsService: LogsService,
  ) {}

  async exportAsBuffer(payload: {
    type: string;
    filters: any;
    userId: number;
  }): Promise<{ buffer: Buffer; filename: string }> {
    const { type, filters, userId } = payload;

    const handler = this.handlers[type];
    if (!handler) {
      throw new BadRequestException(`Tipo de exportación no válido: ${type}`);
    }

    try {
      const { data } = await handler(filters);

      const { buffer, filename } = await generateCSVBuffer(type, data);

      await safeLog(this.logsService, {
        userId,
        action: 'EXPORT',
        tableName: type,
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: { filters },
        status: 'success',
        description: `Exportación exitosa de ${type}`,
      });

      return { buffer, filename };
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        action: 'EXPORT',
        tableName: type,
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: { filters },
        status: 'error',
        description: `Error al exportar ${type}: ${error.message}`,
      });

      throw new InternalServerErrorException(
        `No se pudo exportar ${type}: ${error.message}`,
      );
    }
  }
}
