import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  genreId: number;

  @ApiProperty()
  publisherId: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isbn: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  publishedAt: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => Object, required: false })
  author?: any;

  @ApiProperty({ type: () => Object, required: false })
  genre?: any;

  @ApiProperty({ type: () => Object, required: false })
  publisher?: any;
}
