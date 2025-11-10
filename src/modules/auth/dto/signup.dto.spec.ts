import { SignupDto } from './signup.dto';
import { EmailValidationTestHelper, PasswordValidationTestHelper, StringValidationTestHelper, ValidationTestHelper } from 'src/common/test/validation.helper';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
  USERNAME_REGEX,
  VALID_PASSWORD_EXAMPLE,
} from 'src/common';

describe('SignupDto Validation', () => {
    const validData = {
        email: 'user@example.com',
        username: 'validuser',
        password: VALID_PASSWORD_EXAMPLE,
        passwordConfirmation: VALID_PASSWORD_EXAMPLE,
    };

    describe('email', () => {
        EmailValidationTestHelper.validateEmailField(SignupDto, validData, true);
    });

    describe('username', () => {
        StringValidationTestHelper.validateStringConstraints(SignupDto, validData, 'username', true, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX); 
    });

    describe('password', () => {
        PasswordValidationTestHelper.validatePasswordField(SignupDto, validData, true);
    });

    describe('passwordConfirmation', () => {
        PasswordValidationTestHelper.validatePasswordField(SignupDto, validData, true, 'passwordConfirmation');

        it('should reject if confirmation does not match password', async () => {
            const dto = { ...validData, passwordConfirmation: 'Different123!' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('match'))).toBe(true);
        });

        it('should accept if confirmation matches password', async () => {
            const dto = { ...validData, passwordConfirmation: validData.password };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });
    });

    describe('optional fields', () => {
        StringValidationTestHelper.validateStringConstraints(SignupDto, validData, 'bio', false, undefined, BIO_MAX_LENGTH);
    });

    describe('complete DTO', () => {
        it('should accept valid signup data', async () => {
            const dto = { ...validData };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject when all fields are missing', async () => {
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, {});
            expect(isValid).toBe(false);
            expect(errors.length).toBeGreaterThanOrEqual(4);
        });
    });
});
