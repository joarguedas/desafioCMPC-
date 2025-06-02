import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del usuario' })
  id: number;

  @ApiProperty({ example: 'usuario@example.com', description: 'Correo electrónico del usuario' })
  email: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin', 'superadmin'],
    description: 'Rol asignado al usuario',
  })
  role: 'user' | 'admin' | 'superadmin';

  @ApiProperty({ example: true, description: 'Estado del usuario (activo o inactivo)' })
  status: boolean;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'Fecha de creación del usuario' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'Fecha de última actualización' })
  updatedAt: Date;
}
