import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT and user info on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = {
        accessToken: 'mocked-token',
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'admin',
        },
      };

      mockAuthService.login.mockResolvedValue(result);

      const response = await authController.login(loginDto);
      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('logout', () => {
    it('should return logout message', async () => {
      const userId = 1;
      const result = { message: 'Sesión cerrada correctamente' };

      mockAuthService.logout.mockResolvedValue(result);

      const response = await authController.logout(userId);
      expect(response).toEqual(result);
      expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
    });
  });
});
