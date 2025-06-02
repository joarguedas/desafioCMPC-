import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { safeLog } from '../common/utils/safe-log.util';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
  ) {}

  async login(dto: LoginDto) {
    console.log('Intento login para:', dto.email);

    const user = await this.usersService.findByEmail(dto.email);

    console.log('Usuario encontrado:', user);

    if (!user || !user.password) {
      await safeLog(this.logsService, {
        userId: undefined,
        tableName: 'auth',
        action: 'LOGIN',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: `Intento fallido de login para ${dto.email} (usuario no encontrado o sin contraseña)`,
      });

      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      await safeLog(this.logsService, {
        userId: user.id,
        tableName: 'auth',
        action: 'LOGIN',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: `Intento fallido de login para ${dto.email} (contraseña incorrecta)`,
      });

      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar si el usuario está activo
    if (user.status === false) {
      await safeLog(this.logsService, {
        userId: user.id,
        tableName: 'auth',
        action: 'LOGIN',
        recordId: undefined,
        dataBefore: undefined,
        dataAfter: undefined,
        status: 'error',
        description: `Intento de login fallido: usuario inactivo (${dto.email})`,
      });

      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    await safeLog(this.logsService, {
      userId: user.id,
      tableName: 'auth',
      action: 'LOGIN',
      recordId: undefined,
      dataBefore: undefined,
      dataAfter: undefined,
      status: 'success',
      description: 'Inicio de sesión exitoso',
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: number) {
    await safeLog(this.logsService, {
      userId,
      tableName: 'auth',
      action: 'LOGOUT',
      recordId: undefined,
      dataBefore: undefined,
      dataAfter: undefined,
      status: 'success',
      description: 'Usuario cerró sesión',
    });

    return { message: 'Sesión cerrada correctamente' };
  }
}
