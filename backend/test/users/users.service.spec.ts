import { InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { LogsService } from '../../src/logs/logs.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { PaginationDto } from '../../src/common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let logsService: any;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    logsService = {
      create: jest.fn(),
    };

    service = new UsersService(userModel, logsService);
  });

  describe('create', () => {
    it('should create a user and return response DTO', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: '123456',
        role: 'admin',
      };

      userModel.findOne.mockResolvedValue(null);
      const hashSpy = jest
        .spyOn(bcrypt, 'hash' as any)
        .mockResolvedValue('hashed' as any);
      userModel.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        role: dto.role,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: function () {
          return this;
        },
      });

      const result = await service.create(dto, 99);

      expect(hashSpy).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
      expect(result.role).toBe(dto.role);
    });

    it('should throw BadRequestException if email exists', async () => {
      userModel.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.create(
          {
            email: 'test@example.com',
            password: '123456',
          },
          99,
        ),
      ).rejects.toThrow('El correo ya está registrado.');
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const rows = [
        {
          id: 1,
          email: 'user@example.com',
          role: 'admin',
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      userModel.findAndCountAll.mockResolvedValue({ rows, count: 1 });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        role: 'user',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userModel.findByPk.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result.email).toBe(user.email);
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update a user and return response DTO', async () => {
      const existing = {
        id: 1,
        email: 'old@example.com',
        role: 'user',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: function () {
          return this;
        },
        update: jest.fn().mockResolvedValue(undefined),
      };
      userModel.findByPk.mockResolvedValue(existing);
      const hashSpy = jest
        .spyOn(bcrypt, 'hash' as any)
        .mockResolvedValue('hashed' as any);

      const dto: UpdateUserDto = { password: 'newpassword' };

      const result = await service.update(1, dto, 99);
      expect(result.email).toBe(existing.email);
      expect(hashSpy).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);
      await expect(service.update(999, {}, 99)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('remove', () => {
    it('should delete user and return message', async () => {
      const user = {
        id: 1,
        email: 'delete@example.com',
        role: 'user',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: function () {
          return this;
        },
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      userModel.findByPk.mockResolvedValue(user);

      const result = await service.remove(1, 99);
      expect(result.message).toBe('Usuario eliminado correctamente');
    });

    it('should throw if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);
      await expect(service.remove(999, 99)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });
  it('should update user without changing password', async () => {
    const existing = {
      id: 1,
      email: 'old@example.com',
      toJSON: function () {
        return this;
      },
      update: jest.fn().mockResolvedValue(undefined),
    };
    userModel.findByPk.mockResolvedValue(existing);

    const dto: UpdateUserDto = { email: 'updated@example.com' };

    const result = await service.update(1, dto, 99);
    expect(result.email).toBe(existing.email);
    expect(existing.update).toHaveBeenCalledWith(dto);
  });
  it('should create default admin if not exists', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({ id: 1 });
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashed');

    await service.onModuleInit();

    expect(userModel.create).toHaveBeenCalled();
  });

  it('should NOT create admin if already exists', async () => {
    userModel.findOne.mockResolvedValue({ id: 99 });

    await service.onModuleInit();

    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on DB error', async () => {
    userModel.findOne.mockResolvedValue(null);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashed');
    userModel.create.mockRejectedValue(new Error('DB fail'));

    await expect(
      service.create({
        email: 'fail@test.com',
        password: '123',
      }),
    ).rejects.toThrow(InternalServerErrorException);

    expect(logsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        description: expect.stringContaining('Error al crear usuario'),
      }),
    );
  });
});
