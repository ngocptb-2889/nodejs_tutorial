import { StringValidationTestHelper } from "src/common/test/validation.helper";
import { CreateCommentDto } from "./create-comment.dto";
import { FIELD_LENGTH } from "src/common";

describe('CreateCommentDto', () => {
  describe('body', () => {
    StringValidationTestHelper.validateStringConstraints(CreateCommentDto, {}, 'body', true, FIELD_LENGTH.BODY_MIN, FIELD_LENGTH.BODY_MAX); 
  });
});