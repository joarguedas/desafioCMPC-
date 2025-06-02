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
  tableName: 'publishers',
  timestamps: true,
  comment: 'Tabla que almacena editoriales de libros',
})
export class Publisher extends Model<Publisher> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único de la editorial',
  })
  declare id: CreationOptional<number>;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Nombre de la editorial (ej. Planeta, Alfaguara)',
  })
  declare name: string;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Estado de la editorial (activa/inactiva)',
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
