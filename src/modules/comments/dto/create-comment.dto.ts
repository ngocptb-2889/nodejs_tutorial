import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FIELD_LENGTH } from 'src/common';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a comment body text.',
    minLength: FIELD_LENGTH.BODY_MIN,
    maxLength: FIELD_LENGTH.BODY_MAX
  })
  @IsString()
  @IsNotEmpty({ 
    message: i18nValidationMessage('app.validation.bodyRequired') 
  })
  @MinLength(FIELD_LENGTH.BODY_MIN, { 
    message: i18nValidationMessage('app.validation.bodyTooShort', {
      minLength: FIELD_LENGTH.BODY_MIN
    })
  })
  @MaxLength(FIELD_LENGTH.BODY_MAX, { 
    message: i18nValidationMessage('app.validation.bodyTooLong', {
      maxLength: FIELD_LENGTH.BODY_MAX
    })
  })
  body: string;
}