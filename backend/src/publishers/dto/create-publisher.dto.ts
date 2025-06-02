import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublisherDto {
  @ApiProperty({
    example: 'Alfaguara',
    description: 'Nombre de la editorial',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
