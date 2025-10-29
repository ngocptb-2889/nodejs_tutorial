import { IsEmail, IsString, MinLength, IsOptional, IsUrl, Matches, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX, IsMatch } from 'src/common';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({message: 'Email is required',})
  email: string;

  @ApiProperty({
    description: 'Username for the account',
    example: 'abcde',
    maxLength: USERNAME_MAX_LENGTH,
    pattern: USERNAME_REGEX.source
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(USERNAME_MAX_LENGTH, { message: 'Username must be at most 30 characters long' })
  @Matches(USERNAME_REGEX, { message: 'Username can only contain letters, numbers, and underscores' })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    minLength: PASSWORD_MIN_LENGTH,
    format: 'password'
  })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: '123456',
    minLength: PASSWORD_MIN_LENGTH,
    format: 'password'
  })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: 'Password confirmation must be at least 6 characters long' })
  @IsMatch('password', { message: 'Password confirmation must match password' })
  passwordConfirmation: string;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Software developer passionate about creating amazing applications',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
    format: 'url'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  image?: string;
}
