import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';

@Table({
  tableName: 'authors',
  timestamps: true,
  comment: 'Tabla que almacena los autores de los libros',
})
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único del autor',
  })
  declare id: CreationOptional<number>;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Nombre completo del autor',
  })
  declare name: string;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Estado del autor (activo/inactivo)',
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
    comment: 'Fecha de última actualización',
  })
  declare updatedAt: CreationOptional<Date>;
}
