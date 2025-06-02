import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiPropertyOptional({
    example: 1,
    description:
      'ID del usuario que realiza la acción (puede ser nulo para procesos del sistema)',
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 'books', description: 'Nombre de la tabla afectada' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiPropertyOptional({ example: 42, description: 'ID del registro afectado' })
  @IsOptional()
  @IsNumber()
  recordId?: number;

  @ApiProperty({
    example: 'CREATE',
    description: 'Tipo de acción realizada (CREATE, UPDATE, DELETE, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({ description: 'Datos antes de la operación' })
  @IsOptional()
  @IsObject()
  dataBefore?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Datos después de la operación' })
  @IsOptional()
  @IsObject()
  dataAfter?: Record<string, any>;

  @ApiProperty({
    example: 'success',
    description: 'Estado de la operación: success o error',
  })
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';

  @ApiPropertyOptional({
    example: 'Falló la validación del campo ISBN',
    description: 'Mensaje descriptivo de error o información adicional',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
