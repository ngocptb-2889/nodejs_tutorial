import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthResponse = {
    email: 'user@example.com',
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
    token: 'jwt.token.here',
  };

  const mockResponse = { user: mockAuthResponse };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          }
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'user@example.com',
      username: 'testuser',
      password: 'Aa@123456',
      passwordConfirmation: 'Aa@123456'
    };

    it('should call authService.signup and return wrapped response', async () => {
      (authService.signup as jest.Mock).mockResolvedValue(mockAuthResponse);

      const result = await controller.signup(signupDto);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(authService.signup).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      (authService.signup as jest.Mock).mockRejectedValue(error);

      await expect(controller.signup(signupDto))
        .rejects
        .toThrow('Service error');

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'user@example.com',
      password: 'Aa@123456'
    };

    it('should call authService.login and return wrapped response', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      const error = new Error('Login failed');
      (authService.login as jest.Mock).mockRejectedValue(error);
      await expect(controller.login(loginDto))
        .rejects
        .toThrow('Login failed');
    });
  });
});