import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'Terror', description: 'Nombre del genero' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
