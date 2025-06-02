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
  tableName: 'genres',
  timestamps: true,
  comment: 'Tabla que almacena los géneros literarios disponibles',
})
export class Genre extends Model<Genre> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único del género',
  })
  declare id: CreationOptional<number>;

  @Index
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Nombre del género (ej. Fantasía, Ciencia Ficción, Romance)',
  })
  declare name: string;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Estado del género (activo/inactivo)',
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
