import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterLogsDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de usuario' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'Filtrar por nombre de tabla' })
  @IsOptional()
  @IsString()
  tableName?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de acción',
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'],
  })
  @IsOptional()
  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'])
  action?: string;

  @ApiPropertyOptional({
    description: 'Fecha inicial del rango (YYYY-MM-DD)',
    example: '2025-05-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha final del rango (YYYY-MM-DD)',
    example: '2025-05-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ example: 1, description: 'Página actual' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de registros por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Obtener todos los registros sin paginación',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  all?: boolean;
}
