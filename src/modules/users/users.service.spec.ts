import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UploadService } from '../upload/upload.service';
import { I18nService } from 'nestjs-i18n';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let uploadService: UploadService;
  let i18n: I18nService;

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    bio: 'Test bio',
    image: 'new-image-url',
  } as User;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUploadService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  const mockI18n = {
    translate: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: UploadService, useValue: mockUploadService },
        { provide: I18nService, useValue: mockI18n },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    uploadService = module.get<UploadService>(UploadService);
    i18n = module.get<I18nService>(I18nService);

    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail(mockUser.email);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findById(mockUser.id);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findBy', () => {
    it('should return user by other column', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const field = 'username' as keyof User;
      const value = mockUser.username;
      const result = await service.findBy(field, value);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { [field]: value } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    const dto: SignupDto = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'Aa@123456',
      passwordConfirmation: 'Aa@123456',
    };

    it('should hash password and save user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockReturnValue({ ...dto, password: 'hashed' });
      mockRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, expect.any(Number));
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ email: dto.email }));
    });
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      const result = await service.validateUser('no@example.com', '123');
      expect(result).toBeNull();
    });

    it('should return user if password matches', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateUser(mockUser.email, 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if password does not match', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validateUser(mockUser.email, 'wrong');
      expect(result).toBeNull();
    });
  });

  describe('findOrFail', () => {
    it('should return user if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findOrFail(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOrFail(99)).rejects.toThrow(NotFoundException);
      expect(i18n.translate).toHaveBeenCalledWith('app.user.notFound');
    });
  });

  describe('updateUser', () => {
    const dto: UpdateUserDto = { bio: 'Updated bio' };
    const req = { headers: { authorization: 'Bearer token' } };
    const mockFile = { originalname: 'avatar.png' } as Express.Multer.File;

    it('should update user without file', async () => {
      jest.spyOn(service, 'findOrFail').mockResolvedValue(mockUser);
      mockRepo.save.mockResolvedValue({ ...mockUser, bio: 'Updated bio' });

      const result = await service.updateUser(1, dto, req);
      expect(result.user.bio).toBe('Updated bio');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should upload new image and delete old image', async () => {
      jest.spyOn(service, 'findOrFail').mockResolvedValue(mockUser);
      mockUploadService.uploadImage.mockResolvedValue('new-image-url');
      mockRepo.save.mockResolvedValue({ ...mockUser, image: 'new-image-url' });

      const result = await service.updateUser(1, dto, req, mockFile);

      expect(uploadService.deleteImage).toHaveBeenCalledWith(mockUser.image);
      expect(uploadService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(result.user.image).toBe('new-image-url');
    });

    it('should throw InternalServerErrorException if upload fails', async () => {
      jest.spyOn(service, 'findOrFail').mockResolvedValue(mockUser);
      uploadService.uploadImage.mockRejectedValue(new Error('upload fail'));

      await expect(service.updateUser(1, dto, req, mockFile))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return formatted user response', () => {
      const req = { headers: { authorization: 'Bearer jwt.token' } };
      const result = service.getCurrentUser(mockUser, req);
      expect(result.user.token).toBe('jwt.token');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('resetPassword', () => {
    it('should update user password and return success message', async () => {
      jest.spyOn(service, 'findOrFail').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');
      mockRepo.save.mockResolvedValue({ ...mockUser, password: 'newHashed' });
      mockI18n.translate.mockReturnValue('Password reset successful');

      const result = await service.resetPassword(1, 'New@12345');
      expect(result).toEqual({ message: 'Password reset successful' });
    });

    it('should throw InternalServerErrorException if any error occurs', async () => {
      jest.spyOn(service, 'findOrFail').mockRejectedValue(new Error('fail'));
      mockI18n.translate.mockReturnValue('Error resetting password');

      await expect(service.resetPassword(1, '123'))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const dto = { username: mockUser.username, bio: mockUser.bio, image: mockUser.image };
      jest.spyOn(UserProfileDto, 'fromEntity').mockReturnValue(dto as UserProfileDto);

      const result = await service.getProfile(mockUser.username);
      expect(result).toEqual(dto);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.getProfile('ghost')).rejects.toThrow(NotFoundException);
      expect(i18n.translate).toHaveBeenCalledWith('app.user.notFound');
    });
  });
});
