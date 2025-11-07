import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { BIO_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from 'src/common';

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
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    pattern: USERNAME_REGEX.source
  })
  @IsOptional()
  @IsString()
  @MinLength(USERNAME_MIN_LENGTH, { 
    message: i18nValidationMessage('app.validation.usernameTooShort', {
      minLength: USERNAME_MIN_LENGTH,
    })
  })
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
    type: 'string',
    maxLength: BIO_MAX_LENGTH
  })
  @IsOptional()
  @IsString()
  @MaxLength(BIO_MAX_LENGTH, {
    message: i18nValidationMessage('app.validation.bioTooLong', {
      maxLength: BIO_MAX_LENGTH,
    })
  })
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
