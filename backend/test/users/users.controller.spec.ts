import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { PaginationDto } from '../../src/common/dto/pagination.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create and return the result', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        role: 'admin',
      };
      const result = { id: 1, ...dto };
      mockUsersService.create.mockResolvedValue(result);

      const response = await controller.create(dto, 1);
      expect(response).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const dto: PaginationDto = { page: 1, limit: 10 };
      const result = { data: [], total: 0 };
      mockUsersService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(dto);
      expect(response).toEqual(result);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should return one user by ID', async () => {
      const result = { id: 1, email: 'a@a.com', role: 'user' };
      mockUsersService.findOne.mockResolvedValue(result);

      const response = await controller.findOne(1);
      expect(response).toEqual(result);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const dto: UpdateUserDto = { email: 'new@test.com' };
      const result = { id: 1, email: 'new@test.com', role: 'admin' };
      mockUsersService.update.mockResolvedValue(result);

      const response = await controller.update(1, dto, 5);
      expect(response).toEqual(result);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto, 5);
    });
  });

  describe('remove', () => {
    it('should remove and return success message', async () => {
      const result = { message: 'Usuario eliminado' };
      mockUsersService.remove.mockResolvedValue(result);

      const response = await controller.remove(2, 5);
      expect(response).toEqual(result);
      expect(mockUsersService.remove).toHaveBeenCalledWith(2, 5);
    });
  });
});
