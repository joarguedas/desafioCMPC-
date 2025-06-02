import { ApiProperty } from '@nestjs/swagger';

export class AuthorResponseDto {
  @ApiProperty({ example: 1, description: 'ID del autor' })
  id: number;

  @ApiProperty({ example: 'Gabriel García Márquez', description: 'Nombre del autor' })
  name: string;

  @ApiProperty({ example: true, description: 'Estado del autor (activo/inactivo)' })
  status: boolean;

  @ApiProperty({
    example: '2024-01-01T12:34:56.789Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T12:34:56.789Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: Date;
}
