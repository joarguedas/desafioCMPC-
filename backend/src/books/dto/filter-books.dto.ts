import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterBooksDto {
  @ApiPropertyOptional({ example: 1, description: 'Filtrar por ID de género' })
  @IsOptional()
  @IsInt()
  genreId?: number;

  @ApiPropertyOptional({ example: 2, description: 'Filtrar por ID de autor' })
  @IsOptional()
  @IsInt()
  authorId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Filtrar por ID de editorial',
  })
  @IsOptional()
  @IsInt()
  publisherId?: number;

  @ApiPropertyOptional({
    example: 'Don Quijote',
    description: 'Filtrar por título del libro',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '9788497592208',
    description: 'Filtrar por ISBN',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar por estado del libro',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página para paginación',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de registros por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Obtener todos los registros sin paginar',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  all?: boolean;
}
