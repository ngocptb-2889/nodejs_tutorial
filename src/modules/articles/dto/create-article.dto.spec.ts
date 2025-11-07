import { ArrayStringValidationTestHelper, StringValidationTestHelper, ValidationTestHelper } from "src/common/test/validation.helper";
import { CreateArticleDto } from "./create-article.dto";
import { FIELD_LENGTH } from "src/common";

describe('CreateArticleDto', () => {
  const validDto = {
    title: 'How to learn NestJS',
    description: 'A comprehensive guide to learning NestJS framework',
    body: '# Introduction\n\nNestJS is a progressive Node.js framework...',
    tagList: ['nestjs', 'nodejs', 'javascript']
  };
  describe('title', () => {
    StringValidationTestHelper.validateStringConstraints(
      CreateArticleDto,
      validDto,
      'title',
      true,
      FIELD_LENGTH.TITLE_MIN,
      FIELD_LENGTH.TITLE_MAX
    );
  });

  describe('description', () => {
    StringValidationTestHelper.validateStringConstraints(
      CreateArticleDto,
      validDto,
      'description',
      true,
      FIELD_LENGTH.DESCRIPTION_MIN,
      FIELD_LENGTH.DESCRIPTION_MAX
    );
  });

  describe('body', () => {
    StringValidationTestHelper.validateStringConstraints(
      CreateArticleDto,
      validDto,
      'body',
      true,
      FIELD_LENGTH.BODY_MIN,
      FIELD_LENGTH.BODY_MAX
    );
  });

  describe('tagList', () => {
    ArrayStringValidationTestHelper.validateArrayOfStrings(
      CreateArticleDto,
      validDto,
      'tagList',
      false
    );
  });

  describe('complete DTO', () => {
    it('should accept valid article data', async () => {
      const dto = {
        title: 'How to learn NestJS',
        description: 'A comprehensive guide to learning NestJS framework',
        body: '# Introduction\n\nNestJS is a progressive Node.js framework...',
        tagList: ['nestjs', 'nodejs', 'javascript']
      };
      const { isValid, errors } = await ValidationTestHelper.validateDto(CreateArticleDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid article data', async () => {
      const dto = {
        title: '',
        description: 'a'.repeat(FIELD_LENGTH.DESCRIPTION_MAX + 1),
        body: 'short',
        tagList: ['validTag', 456]
      };
      const { isValid, errors } = await ValidationTestHelper.validateDto(CreateArticleDto, dto);
      expect(isValid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});