import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FIELD_LENGTH } from 'src/common';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'How to learn NestJS',
    minLength: FIELD_LENGTH.TITLE_MIN,
    maxLength: FIELD_LENGTH.TITLE_MAX
  })
  @IsString()
  @IsNotEmpty({ 
    message: i18nValidationMessage('app.validation.titleRequired') 
  })
  @MinLength(FIELD_LENGTH.TITLE_MIN, { 
    message: i18nValidationMessage('app.validation.titleTooShort', {
      minLength: FIELD_LENGTH.TITLE_MIN
    })
  })
  @MaxLength(FIELD_LENGTH.TITLE_MAX, { 
    message: i18nValidationMessage('app.validation.titleTooLong', {
      maxLength: FIELD_LENGTH.TITLE_MAX
    })
  })
  title: string;

  @ApiProperty({
    description: 'Article description',
    example: 'A comprehensive guide to learning NestJS framework',
    minLength: FIELD_LENGTH.DESCRIPTION_MIN,
    maxLength: FIELD_LENGTH.DESCRIPTION_MAX
  })
  @IsString()
  @IsNotEmpty({ 
    message: i18nValidationMessage('app.validation.descriptionRequired') 
  })
  @MinLength(FIELD_LENGTH.DESCRIPTION_MIN, { 
    message: i18nValidationMessage('app.validation.descriptionTooShort', {
      minLength: FIELD_LENGTH.DESCRIPTION_MIN
    })
  })
  @MaxLength(FIELD_LENGTH.DESCRIPTION_MAX, { 
    message: i18nValidationMessage('app.validation.descriptionTooLong', {
      maxLength: FIELD_LENGTH.DESCRIPTION_MAX
    })
  })
  description: string;

  @ApiProperty({
    description: 'Article body content',
    example: '# Introduction\n\nNestJS is a progressive Node.js framework...',
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

  @ApiPropertyOptional({
    description: 'Article tags',
    example: ['nestjs', 'nodejs', 'javascript'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[];
}