import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ 
    summary: 'User registration',
    description: 'Register a new user account and receive an access token'
  })
  @ApiBody({ 
    type: SignupDto,
    description: 'User registration data',
    examples: {
      complete: {
        summary: 'Complete registration',
        value: {
          users: {
            email: 'user@example.com',
            username: 'abcde',
            password: 'Aa@123456',
            passwordConfirmation: 'Aa@123456',
            bio: 'Software developer',
            image: 'https://example.com/avatar.jpg'
          }
        }
      },
      minimal: {
        summary: 'Minimal registration',
        value: {
          users: {
            email: 'user@example.com',
            username: 'abcde',
            password: 'Aa@123456',
            passwordConfirmation: 'Aa@123456'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User registered successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation errors or email already exists' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Passwords do not match or email already in use' 
  })
  @Post('/')
  async signup(@Body('user') input: SignupDto): Promise<{ user: AuthResponseDto }> {
    const result = await this.authService.signup(input);
    return { user: result };
  }

  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user credentials and receive an access token'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'Login example',
        value: {
          users: {
            username: 'testuser',
            email: 'user@example.com',
            password: 'Aa@123456'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request - validation errors' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid credentials' 
  })
  @Post('login')
  async login(@Body('user') input: LoginDto): Promise<{ user: AuthResponseDto }> {
    const result = await this.authService.login(input);
    return { user: result };
  }
}
