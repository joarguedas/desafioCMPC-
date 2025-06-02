export interface ExportableService {
  findAll(filters: any): Promise<{ data: any[]; total?: number }>;
}