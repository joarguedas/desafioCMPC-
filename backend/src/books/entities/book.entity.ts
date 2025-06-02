import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';
import { Author } from '../../authors/entities/author.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'books',
  timestamps: true,
  comment: 'Tabla que almacena los libros disponibles en el sistema',
})
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único del libro',
  })
  declare id: CreationOptional<number>;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Título del libro',
  })
  declare title: string;

  @ForeignKey(() => Author)
  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'ID del autor del libro',
  })
  declare authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @ForeignKey(() => Genre)
  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'ID del género literario del libro',
  })
  declare genreId: number;

  @BelongsTo(() => Genre)
  genre: Genre;

  @ForeignKey(() => Publisher)
  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'ID de la editorial responsable',
  })
  declare publisherId: number;

  @BelongsTo(() => Publisher)
  publisher: Publisher;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
    comment: 'Descripción del contenido del libro',
  })
  declare description: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING(13),
    allowNull: false,
    comment: 'Código ISBN único que identifica el libro',
  })
  declare isbn: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Precio en pesos chilenos',
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Cantidad disponible en stock',
  })
  declare stock: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: 'Fecha de publicación del libro',
  })
  declare publishedAt: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Ruta o URL de la imagen de portada del libro',
  })
  declare imageUrl?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'ID del usuario que creó el registro',
  })
  declare created_by?: number;

  @BelongsTo(() => User, 'created_by')
  createdBy?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'ID del usuario que modificó el registro por última vez',
  })
  declare updated_by?: number;

  @BelongsTo(() => User, 'updated_by')
  updatedBy?: User;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Estado del libro (activo/inactivo)',
  })
  declare status: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Fecha de creación del registro',
  })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Fecha de última modificación',
  })
  declare updatedAt: CreationOptional<Date>;
}
