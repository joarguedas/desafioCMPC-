import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'claveSegura123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Rol del usuario',
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  })
  @IsOptional()
  @IsEnum(['user', 'admin', 'superadmin'])
  role?: 'user' | 'admin' | 'superadmin';
}
