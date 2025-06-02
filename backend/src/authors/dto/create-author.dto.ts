import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Gabriel García Márquez',
    description: 'Nombre completo del autor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
