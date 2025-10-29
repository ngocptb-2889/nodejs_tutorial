import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { HTTP_OK, HTTP_UNAUTHORIZED } from 'src/common';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1'
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Returns the profile information of the currently authenticated user'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: HTTP_OK, 
    description: 'User profile retrieved successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HTTP_UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: any): UserResponseDto {
    return req.user;
  }
}
