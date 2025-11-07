import { IsEmail, IsString, MinLength, IsOptional, IsUrl, Matches, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MAX_LENGTH, USERNAME_REGEX, IsMatch, USERNAME_MIN_LENGTH, BIO_MAX_LENGTH } from 'src/common';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { 
    message: i18nValidationMessage('app.validation.emailInvalid') 
  })
  @IsNotEmpty({ 
    message: i18nValidationMessage('app.validation.emailRequired') 
  })
  email: string;

  @ApiProperty({
    description: 'Username for the account',
    example: 'abcde',
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    pattern: USERNAME_REGEX.source
  })
  @IsString()
  @IsNotEmpty({ 
    message: i18nValidationMessage('app.validation.usernameRequired') 
  })
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
  username: string;

  @ApiProperty({
    description: 'User password (must contain uppercase, lowercase, and special characters)',
    example: 'Password123!',
    minLength: PASSWORD_MIN_LENGTH,
    format: 'password',
    pattern: PASSWORD_REGEX.source
  })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { 
    message: i18nValidationMessage('app.validation.passwordTooShort', {
      minLength: PASSWORD_MIN_LENGTH,
    })
  })
  @Matches(PASSWORD_REGEX, { 
    message: i18nValidationMessage('app.validation.passwordComplexity') 
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'Password123!',
    minLength: PASSWORD_MIN_LENGTH,
    format: 'password'
  })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { 
    message: i18nValidationMessage('app.validation.passwordConfirmationTooShort', {
      minLength: PASSWORD_MIN_LENGTH,
    })
  })
  @IsMatch('password', { 
    message: i18nValidationMessage('app.validation.passwordsDoNotMatch') 
  })
  passwordConfirmation: string;

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
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
    format: 'url'
  })
  @IsOptional()
  @IsUrl({}, { 
    message: i18nValidationMessage('app.validation.invalidUrl') 
  })
  image?: string;
}
