import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, Matches, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USERNAME_MAX_LENGTH, USERNAME_REGEX } from 'src/common';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsOptional()
  @IsEmail({}, { 
    message: i18nValidationMessage('app.validation.emailInvalid') 
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Username for the account',
    example: 'johndoe',
    maxLength: USERNAME_MAX_LENGTH,
    pattern: USERNAME_REGEX.source
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERNAME_MAX_LENGTH, { 
    message: i18nValidationMessage('app.validation.usernameTooLong', {
      maxLength: USERNAME_MAX_LENGTH,
    })
  })
  @Matches(USERNAME_REGEX, { 
    message: i18nValidationMessage('app.validation.usernameInvalid') 
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Software developer passionate about creating amazing applications',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Profile image file',
    type: 'string',
    format: 'binary'
  })
  @IsOptional()
  @IsString()
  image?: any;
}
