import { ArrayStringValidationTestHelper, StringValidationTestHelper, ValidationTestHelper } from "src/common/test/validation.helper";
import { UpdateArticleDto } from "./update-article.dto";
import { FIELD_LENGTH } from "src/common";

describe('UpdateArticleDto', () => {
  describe('title', () => {
    StringValidationTestHelper.validateStringConstraints(
      UpdateArticleDto,
      {},
      'title',
      false,
      FIELD_LENGTH.TITLE_MIN,
      FIELD_LENGTH.TITLE_MAX
    );
  });

  describe('description', () => {
    StringValidationTestHelper.validateStringConstraints(
      UpdateArticleDto,
      {},
      'description',
      false,
      FIELD_LENGTH.DESCRIPTION_MIN,
      FIELD_LENGTH.DESCRIPTION_MAX
    );
  });

  describe('body', () => {
    StringValidationTestHelper.validateStringConstraints(
      UpdateArticleDto,
      {},
      'body',
      false,
      FIELD_LENGTH.BODY_MIN,
      FIELD_LENGTH.BODY_MAX
    );
  });

  describe('tagList', () => {
    ArrayStringValidationTestHelper.validateArrayOfStrings(
      UpdateArticleDto,
      {},
      'tagList',
      false
    );
  });

  describe('complete DTO', () => {
    it('should accept valid article update data', async () => {
      const dto = {
        title: 'Updated Article Title',
        description: 'Updated description for the article.',
        body: 'This is the updated body of the article.',
        tagList: ['updated', 'article']
      };
      const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateArticleDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should accept empty DTO', async () => {
      const dto = {};
      const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateArticleDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
  });
});