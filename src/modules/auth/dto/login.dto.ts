import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from 'src/common';

export class LoginDto {
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
}
