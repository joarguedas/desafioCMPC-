import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreDto {
  @ApiProperty({ example: 'Terror', description: 'Nombre del genero' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: true,
    description: 'Estado del genero (activo/inactivo)',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
