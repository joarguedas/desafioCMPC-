import { LogsService } from '../../logs/logs.service';
import { Log } from '../../logs/entities/log.entity';

export async function safeLog(
  logsService: LogsService,
  logData: Partial<Log>,
): Promise<void> {
  try {
    await logsService.create(logData);
  } catch (err) {
    console.error('Error saving log:', err);
  }
}
