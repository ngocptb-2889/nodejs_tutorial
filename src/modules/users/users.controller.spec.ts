import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'user@example.com',
  };

  const mockRequest = {
    headers: { authorization: 'Bearer fake.jwt.token' },
  };

  const mockUserResponse: { user: UserResponseDto } = {
    user: {
      username: 'testuser',
      email: 'user@example.com',
      bio: null,
      image: null,
      token: 'jwt.token.here',
    } as UserResponseDto,
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'avatar.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    destination: 'uploads/',
    filename: 'avatar-123456.jpg',
    path: 'uploads/avatar-123456.jpg',
    buffer: Buffer.from('fake image data'),
    stream: new Readable(),      
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getCurrentUser: jest.fn(),
            updateUser: jest.fn(),
            resetPassword: jest.fn(),
          }
        }
      ]
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: jest.fn(() => true )})
    .overrideInterceptor(FileInterceptor('image'))
    .useValue({ intercept: jest.fn((context: any, next: any) => next.handle()) })
    .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getCurrentUser', () => {
    it('should call usersService.getCurrentUser and return its result', async () => {
      (usersService.getCurrentUser as jest.Mock).mockReturnValue(mockUserResponse);
      const result = controller.getCurrentUser(mockUser, mockRequest);
      expect(usersService.getCurrentUser).toHaveBeenCalledWith(mockUser, mockRequest);
      expect(result).toEqual(mockUserResponse);
    });

    it('should handle errors from usersService.getCurrentUser', async () => {
      const errorMessage = 'Error fetching user profile';
      (usersService.getCurrentUser as jest.Mock).mockImplementation(() => { throw new Error(errorMessage); });
      await expect(async () => controller.getCurrentUser(mockUser, mockRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      username: 'updateduser',
      email: 'updated@example.com',
      bio: 'Updated bio',
    };

    it('should call usersService.updateUser with correct parameters', async () => {
      (usersService.updateUser as jest.Mock).mockResolvedValue(mockUserResponse);
      
      const result = await controller.updateUser(mockRequest, mockUser, updateUserDto, mockFile);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto, mockRequest, mockFile);
      expect(result).toEqual(mockUserResponse); 
    });

    it('should call usersService.updateUser even when no file is provided', async () => {
      (usersService.updateUser as jest.Mock).mockResolvedValue(mockUserResponse);
      
      const result = await controller.updateUser(mockRequest, mockUser, updateUserDto, undefined);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto, mockRequest, undefined);
      expect(result).toEqual(mockUserResponse);
    });

    it('should handle empty updateUserDto', async () => {
      (usersService.updateUser as jest.Mock).mockResolvedValue(mockUserResponse);
      
      const emptyDto: UpdateUserDto = {};
      const result = await controller.updateUser(mockRequest, mockUser, emptyDto, undefined);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, emptyDto, mockRequest, undefined);
      expect(result).toEqual(mockUserResponse); 
    });

    it('should handle partial updateUserDto', async () => {
      (usersService.updateUser as jest.Mock).mockResolvedValue(mockUserResponse);
      
      const partialDto: UpdateUserDto = { bio: 'Partially updated bio' };
      const result = await controller.updateUser(mockRequest, mockUser, partialDto, undefined);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, partialDto, mockRequest, undefined);
      expect(result).toEqual(mockUserResponse); 
    });

    it('should propagate errors from usersService.updateUser', async () => {
      const errorMessage = 'Error updating user profile';
      (usersService.updateUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updateUser(mockRequest, mockUser, updateUserDto, mockFile)
      ).rejects.toThrow(errorMessage);
    });

    it('should handle file upload errors', async () => {
      const errorMessage = 'File upload error';
      
      (usersService.updateUser as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const invalidFile = { ...mockFile, mimetype: 'text/plain' };
      
      await expect(
        controller.updateUser(mockRequest, mockUser, updateUserDto, invalidFile)
      ).rejects.toThrow(errorMessage);
    });

    it('should handle large file upload errors', async () => {
      const errorMessage = 'File too large';
      
      (usersService.updateUser as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const largeFile = { ...mockFile, size: 10 * 1024 * 1024 }; // 10MB
      
      await expect(
        controller.updateUser(mockRequest, mockUser, updateUserDto, largeFile)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('resetPassword', () => {
    it('should call usersService.resetPassword with correct parameters', async () => {
      const resetPasswordDto = {
        password: 'newPassword123',
        passwordConfirmation: 'newPassword123'
      };
      (usersService.resetPassword as jest.Mock).mockResolvedValue(undefined);
      
      await controller.resetPassword(mockUser, resetPasswordDto);
      expect(usersService.resetPassword).toHaveBeenCalledWith(mockUser.id, resetPasswordDto.password);
    });

    it('should propagate errors from usersService.resetPassword', async () => {
      const resetPasswordDto = {
        password: 'newPassword123',
        passwordConfirmation: 'newPassword123aaa'
      };
      const errorMessage = 'Error resetting password';
      (usersService.resetPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.resetPassword(mockUser, resetPasswordDto)
      ).rejects.toThrow(errorMessage);
    });
  });
});
