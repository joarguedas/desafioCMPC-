import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { LogsModule } from '../logs/logs.module';
import { BooksModule } from '../books/books.module';
import { LogsService } from '../logs/logs.service';
import { BooksService } from '../books/books.service';
import { createExportHandlers } from './utils/export-handlers';

@Module({
  imports: [LogsModule, BooksModule],
  controllers: [ExportController],
  providers: [
    {
      provide: 'EXPORT_HANDLERS',
      useFactory: (logsService: LogsService, booksService: BooksService) =>
        createExportHandlers(logsService, booksService),
      inject: [LogsService, BooksService],
    },
    {
      provide: ExportService,
      useFactory: (
        handlers: ReturnType<typeof createExportHandlers>,
        logsService: LogsService,
      ) => new ExportService(handlers, logsService),
      inject: ['EXPORT_HANDLERS', LogsService],
    },
  ],
})
export class ExportModule {}