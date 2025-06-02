import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { safeLog } from '../common/utils/safe-log.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { LogsService } from '../logs/logs.service';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly logsService: LogsService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userId?: number,
  ): Promise<UserResponseDto> {
    try {
      const {
        email,
        password,
        role = 'user',
      }: {
        email: string;
        password: string;
        role?: 'user' | 'admin' | 'superadmin';
      } = createUserDto;

      const existingUser = await this.userModel.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('El correo ya está registrado.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        role,
      } as CreationAttributes<User>);

      await safeLog(this.logsService, {
        userId,
        tableName: 'users',
        action: 'CREATE',
        recordId: user.id,
        dataBefore: undefined,
        dataAfter: user.toJSON(),
        status: 'success',
        description: 'Usuario creado correctamente',
      });

      return this.toResponseDto(user);
    } catch (error) {
      await safeLog(this.logsService, {
        userId,
        tableName: 'users',
        action: 'CREATE',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: 'Error al crear usuario: ' + error.message,
      });

      throw new InternalServerErrorException(
        'Error al crear el usuario: ' + error.message,
      );
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    const { page = 1, limit = 10, all = false } = pagination;

    try {
      const queryOptions: any = {
        where: { status: true },
        order: [['createdAt', 'DESC']],
      };

      if (!all) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit; 
      }

      const { rows, count } =
        await this.userModel.findAndCountAll(queryOptions);

      return {
        data: rows.map(this.toResponseDto),
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los usuarios: ' + error.message,
      );
    }
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      attributes: { include: ['password'] }, // 🔥 Incluye explícitamente el password
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userId?: number,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const dataBefore = user.toJSON();

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await user.update(updateUserDto);

    await safeLog(this.logsService, {
      userId,
      tableName: 'users',
      action: 'UPDATE',
      recordId: user.id,
      dataBefore,
      dataAfter: user.toJSON(),
      status: 'success',
      description: 'Usuario actualizado correctamente',
    });

    return this.toResponseDto(user);
  }

  async remove(id: number, userId?: number): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const dataBefore = user.toJSON();
    user.status = false;
    await user.save();
    await safeLog(this.logsService, {
      userId,
      tableName: 'users',
      action: 'DELETE',
      recordId: id,
      dataBefore,
      dataAfter: undefined,
      status: 'success',
      description: 'Usuario eliminado correctamente',
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  private toResponseDto(user: User): UserResponseDto {
    const { id, email, role, status, createdAt, updatedAt } = user;
    return { id, email, role, status, createdAt, updatedAt };
  }

  async onModuleInit(): Promise<void> {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await this.userModel.findOne({
      where: { email: adminEmail },
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.userModel.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: true,
      } as CreationAttributes<User>);

      console.log(`✅ Usuario administrador creado:
        Email: ${adminEmail}
        Password: ${adminPassword}
      `);
    }
  }
}
