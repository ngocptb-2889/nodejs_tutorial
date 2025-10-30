import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, IsMatch } from 'src/common';

export class ResetPasswordDto {
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
}
