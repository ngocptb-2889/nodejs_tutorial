import { Controller, Get, Put, Req, UseGuards, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { IMAGE_FILE_TYPE, imageUploadConfig, LIMIT_IMAGE_SIZE } from 'src/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Returns the profile information of the currently authenticated user'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Get user profile successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getCurrentUser(@CurrentUser() user: any, @Req() req: any): { user: UserResponseDto } {
    return this.usersService.getCurrentUser(user, req);
  }
  
  @ApiOperation({ 
    summary: 'Update user profile',
    description: 'Updates the profile information of the currently authenticated user with optional image upload'
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile data with optional image file',
    type: UpdateUserDto,
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'User profile updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data, file too large (max 5MB), or unsupported file format (only jpeg, jpg, png, gif, webp allowed)' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', imageUploadConfig))
  @Put('/')
  async updateUser(
    @Req() req: any,
    @CurrentUser() user: any,
    @Body('user') updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: LIMIT_IMAGE_SIZE }), // 5MB
          new FileTypeValidator({ fileType: IMAGE_FILE_TYPE }),
        ],
        fileIsRequired: false,
      })
    ) file?: Express.Multer.File
  ): Promise<{ user: UserResponseDto }> {
    return await this.usersService.updateUser(user.id, updateUserDto, req, file);
  }

  @ApiOperation({ 
    summary: 'Reset user password',
    description: 'Allows the currently authenticated user to reset their password'
  })
  @ApiBearerAuth()
  @ApiBody({
    description: 'New password data',
    type: ResetPasswordDto,
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Password reset successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Put('/reset-password')
  async resetPassword(
    @CurrentUser() user: any,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }>  {
    return await this.usersService.resetPassword(user.id, resetPasswordDto.password);
  }
}
