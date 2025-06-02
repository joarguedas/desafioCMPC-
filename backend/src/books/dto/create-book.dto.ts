import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad', description: 'Título del libro' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: 'ID del autor del libro' })
  @IsInt()
  authorId: number;

  @ApiProperty({ example: 2, description: 'ID del género del libro' })
  @IsInt()
  genreId: number;

  @ApiProperty({ example: 3, description: 'ID de la editorial del libro' })
  @IsInt()
  publisherId: number;

  @ApiProperty({ example: 'Novela de realismo mágico...', description: 'Descripción del libro' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '9788497592208', description: 'Código ISBN del libro' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 15990, description: 'Precio del libro en CLP' })
  @IsInt()
  price: number;

  @ApiProperty({ example: 100, description: 'Cantidad disponible en stock' })
  @IsInt()
  stock: number;

  @ApiProperty({ example: '2005-03-01', description: 'Fecha de publicación del libro' })
  @IsDateString()
  publishedAt: string;

  @ApiPropertyOptional({
    example: 'https://example.com/portada.jpg',
    description: 'URL o ruta local de la imagen de portada',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
