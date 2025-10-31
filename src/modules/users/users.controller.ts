import { Controller, Get, Put, Req, UseGuards, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { imageUploadConfig } from 'src/common';
import { HTTP_OK, HTTP_UNAUTHORIZED, HTTP_BAD_REQUEST } from 'src/common';
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
    status: HTTP_OK, 
    description: 'Get user profile successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HTTP_UNAUTHORIZED, 
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
    status: HTTP_OK, 
    description: 'User profile updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HTTP_BAD_REQUEST, 
    description: 'Invalid input data, file too large (max 5MB), or unsupported file format (only jpeg, jpg, png, gif, webp allowed)' 
  })
  @ApiResponse({ 
    status: HTTP_UNAUTHORIZED, 
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
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp)$/ }),
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
    status: HTTP_OK, 
    description: 'Password reset successfully'
  })
  @ApiResponse({ 
    status: HTTP_BAD_REQUEST, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: HTTP_UNAUTHORIZED, 
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
