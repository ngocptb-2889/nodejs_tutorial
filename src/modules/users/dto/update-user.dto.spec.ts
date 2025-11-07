import { UpdateUserDto } from './update-user.dto';
import {
  BIO_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'src/common';
import { EmailValidationTestHelper, StringValidationTestHelper } from 'src/common/test/validation.helper';

describe('UpdateUserDto', () => {
  describe('email', () => {
    EmailValidationTestHelper.validateEmailField(UpdateUserDto, {}, false);
  });

  describe('username', () => {
    StringValidationTestHelper.validateStringConstraints(
      UpdateUserDto,
      {},
      'username',
      false,
      USERNAME_MIN_LENGTH,
      USERNAME_MAX_LENGTH,
      USERNAME_REGEX
    );
  });

  describe('optional fields', () => {
    StringValidationTestHelper.validateStringConstraints(
      UpdateUserDto,
      {},
      'bio',
      false,
      undefined,
      BIO_MAX_LENGTH
    );
  });
});
