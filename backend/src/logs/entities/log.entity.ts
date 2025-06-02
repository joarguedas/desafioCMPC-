import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Table({
  tableName: 'logs',
  timestamps: true,
  indexes: [
    { name: 'logs_table_name', fields: ['tableName'] },
    { name: 'logs_action', fields: ['action'] },
    { name: 'logs_status', fields: ['status'] },
    { name: 'logs_created_at', fields: ['created_at'] },
  ],
})
export class Log extends Model<Log> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: 'ID único del log',
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'user_id',
    comment: 'ID del usuario que realizó la operación',
  })
  declare userId?: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Nombre de la tabla afectada',
  })
  declare tableName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'record_id',
    comment: 'ID del registro afectado',
  })
  declare recordId?: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Tipo de acción realizada (CREATE, UPDATE, DELETE, etc.)',
  })
  declare action: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'data_before',
    comment: 'Datos antes de la operación',
  })
  declare dataBefore?: object;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'data_after',
    comment: 'Datos después de la operación',
  })
  declare dataAfter?: object;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'success',
    comment: 'Estado de la operación (success, error)',
  })
  declare status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Mensaje de error o descripción adicional',
  })
  declare description?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
    comment: 'Fecha y hora de la operación',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
    comment: 'Fecha y hora de la operación',
  })
  declare updatedAt: Date;
}
