import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../../src/logs/logs.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let logsService: LogsService;
  let mockUser: any;

  beforeEach(async () => {
    mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      status: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: LogsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    logsService = module.get<LogsService>(LogsService);
  });

  it('debería devolver token y usuario válido con credenciales correctas', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    const result = await service.login({ email: 'test@example.com', password: 'password123' });
    expect(result).toHaveProperty('accessToken', 'test-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('debería lanzar UnauthorizedException si usuario no existe', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    await expect(service.login({ email: 'nope@example.com', password: '123' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('debería lanzar UnauthorizedException si contraseña es incorrecta', async () => {
    const wrongPasswordUser = { ...mockUser, password: await bcrypt.hash('otra', 10) };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(wrongPasswordUser);
    await expect(service.login({ email: 'test@example.com', password: 'incorrecta' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('debería lanzar UnauthorizedException si el usuario está inactivo', async () => {
    const inactiveUser = { ...mockUser, status: false };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(inactiveUser);
    await expect(service.login({ email: 'test@example.com', password: 'password123' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('debería registrar correctamente el logout', async () => {
    const result = await service.logout(1);
    expect(result.message).toBe('Sesión cerrada correctamente');
  });
});
