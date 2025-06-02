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
  HasMany,
} from 'sequelize-typescript';
import { Log } from '../../logs/entities/log.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  comment: 'Tabla que almacena los usuarios de la plataforma',
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único del usuario',
  })
  declare id: number; // ← usamos declare para evitar el error TS2612

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Correo electrónico del usuario',
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Contraseña encriptada del usuario',
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('user', 'admin', 'superadmin'),
    defaultValue: 'user',
    comment: 'Rol del usuario dentro del sistema',
  })
  declare role: 'user' | 'admin' | 'superadmin';

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Estado del usuario (activo/inactivo)',
  })
  declare status: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Fecha de creación del usuario',
  })
  declare createdAt: Date; // ← declare evita error de sobreescritura

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Fecha de última actualización del usuario',
  })
  declare updatedAt: Date; // ← declare evita error de sobreescritura

  @HasMany(() => Log)
  logs?: Log[];
}
