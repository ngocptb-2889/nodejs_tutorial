import { ArrayStringValidationTestHelper, StringValidationTestHelper } from "src/common/test/validation.helper";
import { ArticleQueryDto } from "./article-query.dto";

describe('ArticleQueryDto', () => {
  describe('tags', () => {
    ArrayStringValidationTestHelper.validateArrayOfStrings(ArticleQueryDto, {}, 'tags', false, true); 
  });

  describe('author', () => {
    StringValidationTestHelper.validateStringConstraints(ArticleQueryDto, {}, 'author', false);
  });
});