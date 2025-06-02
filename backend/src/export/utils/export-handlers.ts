import { LogsService } from '../../logs/logs.service';
import { BooksService } from '../../books/books.service';

export type ExportHandlers = Record<
  string,
  (filters: any) => Promise<{ data: any[] }>
>;

export const createExportHandlers = (
  logsService: LogsService,
  booksService: BooksService,
): ExportHandlers => ({
  logs: (filters) => logsService.findAll({ ...filters, all: true }),
  books: (filters) => booksService.findAll({ ...filters, all: true }),
});
