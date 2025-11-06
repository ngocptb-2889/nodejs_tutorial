import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let i18nService: I18nService;

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    email: mockUser.email,
    username: mockUser.username,
    bio: mockUser.bio,
    image: mockUser.image,
    token: 'jwt.token.here',
  };

  const mockRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(() => ({
      id: 1,
      email: 'test@example.com',
      username: 'tester',
      bio: null,
      image: null,
    })),
    validateUser: jest.fn(),
  };

  const mockI18n = {
    translate: jest.fn().mockImplementation((key: string) => {
      const messages = {
        'app.validation.emailAlreadyExists': 'Email already exists',
        'app.validation.invalidCredentials': 'Invalid credentials',
      };
      return messages[key] || key;
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockRepo,},
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('jwt.token.here') }},
        { provide: I18nService, useValue: mockI18n },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    i18nService = module.get<I18nService>(I18nService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'user@example.com',
      username: 'testuser',
      password: 'Aa@123456',
      passwordConfirmation: 'Aa@123456'
    };

    it('should throw UnauthorizedException if email already exists', async () => {
      (mockRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.signup(signupDto))
        .rejects
        .toThrow(UnauthorizedException);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
      
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should create user and return auth response if email not exists', async () => {
      (mockRepo.findByEmail as jest.Mock).mockResolvedValue(null);
      (mockRepo.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.signup(signupDto);

      expect(result).toEqual(mockAuthResponse);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockRepo.create).toHaveBeenCalledWith(signupDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should translate error message using i18n', async () => {
      (mockRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.signup(signupDto))
        .rejects
        .toThrow(new UnauthorizedException('Email already exists'));

      expect(i18nService.translate).toHaveBeenCalledWith('app.validation.emailAlreadyExists');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'user@example.com',
      password: 'Aa@123456'
    };

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      (mockRepo.validateUser as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(UnauthorizedException);

      expect(mockRepo.validateUser).toHaveBeenCalledWith(
        loginDto.email, 
        loginDto.password
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should return auth response if credentials are valid', async () => {
      (mockRepo.validateUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login(loginDto);

      expect(result).toEqual(mockAuthResponse);

      expect(mockRepo.validateUser).toHaveBeenCalledWith(
        loginDto.email, 
        loginDto.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should translate error message using i18n', async () => {
      (mockRepo.validateUser as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(new UnauthorizedException('Invalid credentials'));

      expect(i18nService.translate).toHaveBeenCalledWith('app.validation.invalidCredentials');
    });
  });

  describe('buildAuthResponse', () => {
    it('should build auth response with JWT token', () => {
      const result = (authService as any).buildAuthResponse(mockUser);

      expect(result).toEqual(mockAuthResponse);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});