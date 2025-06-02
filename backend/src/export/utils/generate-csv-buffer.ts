import { Parser } from 'json2csv';

export async function generateCSVBuffer(
  type: string,
  data: any[],
): Promise<{ buffer: Buffer; filename: string }> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No hay datos disponibles para exportar "${type}"`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${type}-${timestamp}.csv`;

  const plainData = data.map(item =>
    typeof item.get === 'function' ? item.get({ plain: true }) : item
  );

  const parser = new Parser({ delimiter: ';' });
  const csv = parser.parse(plainData);

  const buffer = Buffer.from(csv, 'utf-8');
  return { buffer, filename };
}
